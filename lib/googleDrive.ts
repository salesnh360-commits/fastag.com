import { google, drive_v3 } from 'googleapis'

type Env = Record<string, string | undefined>
const ENV = process.env as Env

function readParentFolderId() {
  return (
    ENV.GOOGLE_DRIVE_PARENT_FOLDER_ID ||
    ENV.GDRIVE_ROOT_FOLDER_ID ||
    undefined
  )
}

function readServiceAccountCreds() {
  const clientEmail = ENV.GOOGLE_DRIVE_CLIENT_EMAIL || ENV.GDRIVE_CLIENT_EMAIL

  // Prefer base64 if present; else plaintext
  let privateKey = undefined as string | undefined
  if (ENV.GDRIVE_PRIVATE_KEY_B64) {
    try { privateKey = Buffer.from(ENV.GDRIVE_PRIVATE_KEY_B64, 'base64').toString('utf8') } catch {}
  }
  if (!privateKey) {
    privateKey = ENV.GOOGLE_DRIVE_PRIVATE_KEY || ENV.GDRIVE_PRIVATE_KEY
  }
  if (privateKey) {
    // Strip accidental wrapping quotes
    if ((privateKey.startsWith('"') && privateKey.endsWith('"')) || (privateKey.startsWith("'") && privateKey.endsWith("'"))) {
      privateKey = privateKey.slice(1, -1)
    }
    privateKey = privateKey.replace(/\\n/g, '\n')
  }

  return { clientEmail, privateKey }
}

function readOAuthCreds() {
  const clientId = ENV.GDRIVE_OAUTH_CLIENT_ID
  const clientSecret = ENV.GDRIVE_OAUTH_CLIENT_SECRET
  const refreshToken = ENV.GDRIVE_OAUTH_REFRESH_TOKEN
  return { clientId, clientSecret, refreshToken }
}

function getAuth() {
  const useOAuth = (ENV.UPLOAD_TARGET === 'gdrive_oauth') || !!ENV.GDRIVE_OAUTH_REFRESH_TOKEN
  if (useOAuth) {
    const { clientId, clientSecret, refreshToken } = readOAuthCreds()
    if (!clientId || !clientSecret || !refreshToken) {
      throw new Error('Missing Google OAuth credentials in env')
    }
    const oauth2 = new google.auth.OAuth2(clientId, clientSecret)
    oauth2.setCredentials({ refresh_token: refreshToken })
    return oauth2
  }

  const { clientEmail, privateKey } = readServiceAccountCreds()
  if (!clientEmail || !privateKey) {
    throw new Error('Missing Google Drive service account credentials in env')
  }
  return new google.auth.JWT(
    clientEmail,
    undefined,
    privateKey,
    ['https://www.googleapis.com/auth/drive']
  )
}

export function getDrive(): drive_v3.Drive {
  const auth = getAuth()
  return google.drive({ version: 'v3', auth })
}

export async function ensureFolder(name: string, parentId?: string): Promise<string> {
  const drive = getDrive()
  const qParts = [
    "mimeType = 'application/vnd.google-apps.folder'",
    `name = '${name.replace(/'/g, "\\'")}'`,
    'trashed = false',
  ]
  const parent = parentId ?? readParentFolderId()
  if (parent) qParts.push(`'${parent}' in parents`)
  const q = qParts.join(' and ')

  const list = await drive.files.list({ q, fields: 'files(id, name, parents)' })
  const existing = list.data.files?.[0]
  if (existing?.id) return existing.id

  const created = await drive.files.create({
    requestBody: {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parent ? [parent] : undefined,
    },
    fields: 'id',
  })
  const id = created.data.id
  if (!id) throw new Error('Failed to create folder on Drive')
  return id
}

export async function uploadBufferToDrive(opts: {
  buffer: Buffer,
  filename: string,
  mimeType?: string,
  folderName: string,
  parentId?: string,
}): Promise<{ fileId: string, url: string }> {
  const drive = getDrive()
  const parent = opts.parentId ?? readParentFolderId()
  const folderId = await ensureFolder(opts.folderName, parent)

  const res = await drive.files.create({
    requestBody: {
      name: opts.filename,
      parents: [folderId],
    },
    media: {
      mimeType: opts.mimeType || 'application/octet-stream',
      body: BufferToStream(opts.buffer),
    },
    fields: 'id',
  })
  const fileId = res.data.id
  if (!fileId) throw new Error('Failed to upload file to Drive')

  if ((ENV.GDRIVE_PUBLIC || 'true').toLowerCase() !== 'false') {
    try {
      await drive.permissions.create({ fileId, requestBody: { role: 'reader', type: 'anyone' } })
    } catch (err) {
      console.error('Drive: failed to set public permission', err)
    }
  }

  const url = `https://drive.google.com/uc?export=view&id=${fileId}`
  return { fileId, url }
}

function BufferToStream(buffer: Buffer) {
  const { Readable } = require('stream') as typeof import('stream')
  const stream = new Readable()
  stream.push(buffer)
  stream.push(null)
  return stream
}
