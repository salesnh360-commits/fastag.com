import Link from "next/link"

export default function SaasFooter() {
  return (
    <footer className="bg-white border-t border-orange-200 text-gray-700">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-orange-600" />
              <span className="text-xl font-bold text-gray-900">NH360 FASTag</span>
            </div>
            <p className="text-gray-600 text-sm">FASTag sales, recharge and support across India.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-gray-900">Services</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/#buy" className="hover:text-orange-700">Buy FASTag</Link></li>
              <li><Link href="/#recharge" className="hover:text-orange-700">Recharge Assistance</Link></li>
              <li><Link href="/#services" className="hover:text-orange-700">KYC Update</Link></li>
              <li><Link href="/#services" className="hover:text-orange-700">Blacklist Removal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-gray-900">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/about" className="hover:text-orange-700">About</Link></li>
              <li><Link href="/reviews" className="hover:text-orange-700">Reviews</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-orange-700">Privacy Policy</Link></li>
              <li><Link href="/return-policy" className="hover:text-orange-700">Refund Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-gray-900">Contact</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>Email: support@nh360fastag.com</li>
              <li>Support: 24×7</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-orange-200 mt-8 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} NH360 FASTag. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
