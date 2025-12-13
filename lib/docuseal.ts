export async function createSigningPacket(opts: {
  baseUrl: string
  apiToken: string
  templateId: string
  submitters: Array<{ name: string; email?: string; phone?: string }>
  fields?: Record<string, string | number | boolean>
}): Promise<{ packetId?: string; signingUrls?: string[]; error?: string }> {
  try {
    const res = await fetch(`${opts.baseUrl}/api/packets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${opts.apiToken}`,
      },
      body: JSON.stringify({
        template_id: opts.templateId,
        submitters: opts.submitters,
        fields: opts.fields || {},
      }),
    })
    if (!res.ok) {
      return { error: `DocuSeal create failed: ${res.status} ${res.statusText}` }
    }
    const j = await res.json().catch(() => ({}))
    const urls: string[] = Array.isArray(j?.submitters)
      ? j.submitters.map((s: any) => s?.signing_url).filter(Boolean)
      : []
    return { packetId: j?.id || j?.packet_id, signingUrls: urls }
  } catch (e: any) {
    return { error: e?.message || "DocuSeal create failed" }
  }
}

export async function downloadCompletedPdf(opts: {
  baseUrl: string
  apiToken: string
  packetId: string
}): Promise<{ blob?: Blob; error?: string }> {
  try {
    const res = await fetch(`${opts.baseUrl}/api/packets/${opts.packetId}/download`, {
      headers: { Authorization: `Bearer ${opts.apiToken}` },
    })
    if (!res.ok) return { error: `DocuSeal download failed: ${res.status} ${res.statusText}` }
    const blob = await res.blob()
    return { blob }
  } catch (e: any) {
    return { error: e?.message || "DocuSeal download failed" }
  }
}
