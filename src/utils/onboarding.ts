export const ONBOARDING_KEY = 'neuron_onboarded_v1'

export function hasCompletedOnboarding(): boolean {
  try {
    return typeof localStorage !== 'undefined' && localStorage.getItem(ONBOARDING_KEY) === '1'
  } catch {
    return false
  }
}

export function markOnboardingComplete(): void {
  try {
    localStorage.setItem(ONBOARDING_KEY, '1')
  } catch {
    // ignore (e.g. private browsing / storage disabled)
  }
}
