import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext"; // assuming you have this

const AffiliatePopup = ({ onClose }: { onClose: () => void }) => {
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter()
const { user, acceptAffiliate } = useAuth();

const handleSubmit = async () => {
  if (!accepted || !user) return;

  setLoading(true);
  try {
    const code = await acceptAffiliate();
    console.log("Affiliate code:", code);
    onClose();
    router.push("/profile");
  } catch (err) {
    alert("Something went wrong!");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Join Our Affiliate Program
        </h3>

        <p className="text-gray-600 mb-6 text-center">
          Accept the terms & conditions and start earning with your affiliate code.
        </p>

        <label className="flex items-center space-x-2 mb-6">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="w-5 h-5"
          />
          <span>I accept the terms and conditions</span>
        </label>

        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
          disabled={!accepted || loading}
          onClick={handleSubmit}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
};

export default AffiliatePopup;
