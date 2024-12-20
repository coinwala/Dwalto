import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
export const LoginDialog = ({
  onGoogleLogin,
  handleLoginClose,
  showLoginView,
}: {
  onGoogleLogin: () => void;
  handleLoginClose: () => void;
  showLoginView: boolean;
}) => (
  <Dialog onOpenChange={handleLoginClose} defaultOpen={showLoginView}>
    <DialogContent className="relative w-full bg-white px-8 pb-8 pt-10 dark:bg-gray-950 mobile:min-w-[390px] mobile:px-10 sm:max-w-[430px] rounded-xl shadow-lg">
      <div className="mx-auto flex flex-shrink-0 items-center justify-center">
        <Image
          src="/icons/logo.png"
          alt="logo"
          width={90}
          height={90}
          priority
        />
      </div>

      <DialogHeader>
        <DialogTitle className="flex justify-center text-center my-3 text-[20px] font-bold leading-none text-gray-800 dark:text-gray-50 mobile:text-[24px]">
          Login to CoinWala
        </DialogTitle>
        <p className="mb-3 text-center text-xs text-gray-600 dark:text-gray-200 mobile:text-base">
          Click below to continue with your Google account.
        </p>
      </DialogHeader>

      <DialogFooter>
        <button
          onClick={onGoogleLogin}
          className="w-full relative h-11 rounded-lg bg-black transition-colors duration-150 ease-linear hover:bg-gray-800"
        >
          <div className="absolute left-[3px] top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md bg-white">
            <FcGoogle className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-white pl-7">Login with Google</h3>
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
