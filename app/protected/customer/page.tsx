import BookCollection from "@/components/customer/bookCollection";
import { createClient } from "@/utils/supabase/server";

export default async function CustomerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <BookCollection user={user} />;
}
