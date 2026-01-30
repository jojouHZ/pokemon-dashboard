export class PokemonApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public pokemon?: string,
  ) {
    super(message)
    this.name = 'PokemonApiError'
  }
}

export function isPokemonApiError(error: unknown): error is PokemonApiError {
  return error instanceof PokemonApiError
}
