export type DealState = 'NEW'|'CONTACTED'|'QUALIFIED'|'OFFER_SENT'|'NEGOTIATING'|'AGREED'|'CONTRACTED'|'DISPO'|'CLOSED'|'DEAD'

const edges: Record<DealState, DealState[]> = {
  NEW: ['CONTACTED','DEAD'],
  CONTACTED: ['QUALIFIED','OFFER_SENT','DEAD'],
  QUALIFIED: ['OFFER_SENT','NEGOTIATING','DEAD'],
  OFFER_SENT: ['NEGOTIATING','AGREED','DEAD'],
  NEGOTIATING: ['AGREED','DEAD'],
  AGREED: ['CONTRACTED','DEAD'],
  CONTRACTED: ['DISPO','CLOSED','DEAD'],
  DISPO: ['CLOSED','DEAD'],
  CLOSED: [],
  DEAD: []
}

export function canTransition(from: DealState, to: DealState): boolean {
  return edges[from]?.includes(to) ?? false
}

export function nextState(current: DealState, hint?: string): DealState {
  if (hint && canTransition(current, hint as DealState)) return hint as DealState
  return current
}

