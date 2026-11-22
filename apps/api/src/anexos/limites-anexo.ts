/** Tamanho máximo do conteúdo decodificado do anexo (bytes). */
export const LIMITE_BYTES_ANEXO = 8 * 1024 * 1024;

/**
 * Limite do body JSON (base64 ≈ 4/3 do binário + metadados).
 * Mantém folga acima de LIMITE_BYTES_ANEXO para validação explícita no serviço.
 */
export const LIMITE_JSON_BODY_ANEXO = "12mb";
