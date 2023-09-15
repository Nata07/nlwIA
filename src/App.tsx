import { FileVideo, Github, Upload, Wand2 } from "lucide-react";
import { Button } from "./components/ui/button";
import { Label } from "./components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Separator } from "./components/ui/separator";
import { Slider } from "./components/ui/slider";
import { Textarea } from "./components/ui/textarea";

export function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 py-5 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold" >Upload AI</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Desenvolvido por Natanael</span>

          <Separator orientation="vertical" className="h-6" />
          <Button variant="outline"> <Github className="m-4 h-4 mr-2" /> Github</Button>
        </div>
      </div>
      <main className="flex-1 p-6 flex gap-6">
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea placeholder="Inclua o prompt para IA" className="resize-none p-4 leading-relaxed" />
            <Textarea placeholder="Resultado Gerado" readOnly className="resize-none p-4 leading-relaxed"/>
          </div>
          <p className="text-muted-foreground text-sm">Lembre-se: voce pode usar a variável <code className="text-violet-400 font-bold">{'transcription'}</code> do seu prompt 
            para adicionar o conteúdo da transcrição do video adicionado
          </p>
        </div>
        <aside className="w-80 space-y-6 ">
          <form className="space-y-6">
            <label 
              htmlFor="video" 
              className="text-sm gap-2 border flex flex-col text-muted-foreground rounded-md aspect-video items-center justify-center hover:bg-primary/20"
            >
              <FileVideo className="w-4 h-4" />
              Selecione um Video 
            </label>
            <input type="file" id="video" accept="video/mp4" className="sr-only" />

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
              <Textarea 
                id="transcription_prompt" 
                className="leading-relaxed h-24 resize-none"
                placeholder="Inclua palavras chaves mencionadas no video separadas por virgula (,)" 
              />
            </div>
            <Button type="submit" className="w-full">
              Carregar Video
              <Upload className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <Separator />

          <form className="space-y-6">
          <div className="space-y-2">
              <Label>Prompt</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue className="text-muted-foreground" placeholder="Selecione um prompt..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Titulo do You tube</SelectItem>
                  <SelectItem value="description">Descrição</SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-xs text-muted-foreground italic">Você pode customizar essa opção em breve</span>
            </div>

            <div className="space-y-2">
              <Label>Modelo</Label>
              <Select disabled defaultValue="gtp3.5">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gtp3.5">GPT 3.5-turbo 10k</SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-xs text-muted-foreground italic">Você pode customizar essa opção em breve</span>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Temperatura</Label>

              <Slider min={0} max={1} step={0.1} />
              
              <span className="block text-xs text-muted-foreground italic leading-relaxed">
                Valores mais altos tendem a deixar o resultado mais criativo e com possiveis erros  
              </span>
            
            <Separator />
            
            <Button className="w-full" type="submit">
              Executar
              <Wand2 className="h-4 w-4 ml-2" />
            </Button>
            </div> 
          </form>
        </aside>
      </main>
    </div>
  )
}
