import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default async function BuyersPage() {
  const supabase = await createClient()
  const { data: buyers } = await supabase.from("buyers").select("*").order("created_at", { ascending: false })
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Cash Buyers</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/settings">
            <Button variant="outline">Settings</Button>
          </Link>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <form
          action="/api/buyers/import"
          method="post"
          className="flex w-full max-w-xl items-center gap-2"
        >
          <Input name="csv" type="file" accept=".csv" />
          <Button type="submit" variant="outline">Import CSV</Button>
        </form>
        <form action="/api/buyers/create" method="post" className="flex w-full max-w-xl items-center gap-2">
          <Input name="name" placeholder="Name" />
          <Input name="phone" placeholder="Phone" />
          <Input name="email" placeholder="Email" />
          <Button type="submit">Add Buyer</Button>
        </form>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        {(buyers || []).map((b: any) => (
          <div key={b.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{b.name}</p>
                <p className="text-sm text-muted-foreground">{b.phone || "-"}</p>
                <p className="text-sm text-muted-foreground">{b.email || "-"}</p>
              </div>
              <form action="/api/buyers/delete" method="post">
                <input type="hidden" name="id" value={b.id} />
                <Button variant="destructive">Delete</Button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
