import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { toast } from "sonner";
import Image from "next/image";
import solcan from "@/public/icons/solscan.webp";
import { ShieldCheck } from "lucide-react";
import { LinkPreview } from "./ui/link-preview";

export default function LinkPopup({
  linkPopupOpen,
  setLinkPopupOpen,
  link,
  signature,
}: {
  linkPopupOpen: boolean;
  link: string;
  signature: string;
  setLinkPopupOpen: (value: boolean) => void;
}) {
  console.log("link", link);
  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    toast("Copied to clipboard");
  };
  const truncateUrl = (urlString: string, length: number = 16) => {
    if (urlString.length <= length) return urlString;
    return urlString.substring(0, length) + "...";
  };
  return (
    <div>
      <Dialog open={linkPopupOpen} onOpenChange={() => setLinkPopupOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex justify-center text-2xl">
              Your CoinWala link
            </DialogTitle>
            <DialogDescription className="flex justify-center">
              <div>
                <div className="flex justify-center mt-5">
                  <LinkPreview
                    isStatic
                    imageSrc="/assets/images/preview.png"
                    url={link}
                  >
                    <Badge className="text-xl p-2" variant="outline">
                      {truncateUrl(link, 32)}
                    </Badge>
                  </LinkPreview>
                </div>

                <div className="flex justify-center mt-5 gap-1">
                  <Button className="w-full" onClick={handleCopy}>
                    Copy
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() =>
                      window.open(
                        `https://solscan.io/tx/${signature}`,
                        "_blank"
                      )
                    }
                  >
                    <Image
                      className="h-5 w-5 mr-2"
                      src={solcan}
                      alt="Solscan"
                    />
                    View on SolScan
                  </Button>
                </div>
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <span>
                      <div>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <span>
                            <ShieldCheck />
                          </span>
                          <span>
                            All CoinWala links are non-custodial wallets.
                          </span>
                        </p>
                      </div>
                    </span>
                  </p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
