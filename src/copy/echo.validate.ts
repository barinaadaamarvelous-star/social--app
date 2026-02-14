import { EchoContract } from "@/contracts/echo.contract";

// Guard that copy does not violate dignity constraints
export function enforceEchoCopySafety() {
  // These just reference the contract intentionally.
  // They are not runtime checks — they document binding.

  EchoContract.mustNotAutoSurface();
  EchoContract.forbidsComparison();
  EchoContract.canHide(true);
  EchoContract.canReveal(true);

  return true;
}
