export type FeatureProposal = {
  name: string
  strengthensClarity: boolean
  improvesSecondUse: boolean
  removableWithoutLoss: boolean
}

/**
 * Feature-Rot Gate
 * If a feature fails ANY check, it is rot.
 */
export function passesFeatureGate(feature: FeatureProposal) {
  return (
    feature.strengthensClarity &&
    feature.improvesSecondUse &&
    feature.removableWithoutLoss
  )
}
