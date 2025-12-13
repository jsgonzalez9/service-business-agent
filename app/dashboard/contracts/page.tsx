import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default async function ContractsPage() {
  const supabase = await createClient()
  const { data: templates } = await supabase.from("contract_templates").select("*").order("created_at", { ascending: false })
  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold text-foreground">Contracts</h1>
      <div className="mt-4">
        <form action="/api/contracts/templates" method="post" encType="multipart/form-data" className="flex items-center gap-2">
          <Input name="file" type="file" accept=".pdf,.docx,.txt" />
          <Input name="name" placeholder="Template name" />
          <Input name="role" placeholder="Role (seller|buyer)" />
          <Input name="state" placeholder="State (optional)" />
          <Button type="submit">Upload Template</Button>
        </form>
        <div className="mt-4">
          <form action="/api/contracts/docuseal/link" method="post" className="flex flex-wrap items-center gap-2">
            <select name="role" defaultValue="seller" className="rounded border border-border bg-background p-2 text-sm">
              <option value="seller">Seller</option>
              <option value="buyer">Buyer</option>
            </select>
            <Input name="state" placeholder="State (optional)" />
            <Input name="templateId" placeholder="DocuSeal template id or URL (e.g. http://localhost:3010/d/...)" />
            <Button type="submit" variant="outline">Link DocuSeal</Button>
          </form>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        {(!templates || templates.length === 0) && (
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">No templates uploaded yet. You can still link a DocuSeal ID or URL using the form above.</p>
          </div>
        )}
        {(templates || []).map((t: any) => (
          <div key={t.id} className="rounded-lg border border-border bg-card p-4">
            <p className="font-medium text-foreground">{t.name}</p>
            <p className="text-sm text-muted-foreground">Role: {t.role}</p>
            <p className="text-sm text-muted-foreground">State: {t.state || "-"}</p>
            <p className="text-xs text-muted-foreground">Path: {t.storage_path}</p>
            <div className="mt-2 flex items-center gap-2">
              <form action="/api/contracts/docuseal/link" method="post" className="flex items-center gap-2">
                <input type="hidden" name="role" value={t.role} />
                <input type="hidden" name="state" value={t.state || ""} />
                <Input name="templateId" placeholder="DocuSeal template id or URL" defaultValue={t.docuseal_template_id || t.docuseal_direct_link || ""} />
                <Button type="submit" variant="outline">Link DocuSeal</Button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
