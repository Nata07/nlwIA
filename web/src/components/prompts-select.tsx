import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

type ItemProps = {
  id: string;
  title: string;
  template: string;
}
interface PromptProps {
  onChangeSelect: (template: string) => void
}
export function PromptSelect({ onChangeSelect}: PromptProps) {
  const [prompts, setPrompts] = useState<ItemProps[] | null>(null)

  async function getPrompts() {
    api.get('/prompts').then(response => {
      setPrompts(response.data.prompts)
    })
  }

  console.log('prompts')
  console.log(prompts)
  
  useEffect(() => {
    getPrompts()
  }, [])
  
  return (
    <Select onValueChange={onChangeSelect}>
      <SelectTrigger className="w-full">
        <SelectValue className="text-muted-foreground" placeholder="Selecione um prompt..." />
      </SelectTrigger>
      <SelectContent>
        {prompts?.map(item => (
          <SelectItem key={item.id} value={item.template}>{item.title}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}