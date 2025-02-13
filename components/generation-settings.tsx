"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Settings2, ChevronDown, ChevronUp, Wand2, SproutIcon as Seedling, XCircle } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface GenerationSettings {
  enablePromptEnhancement?: boolean
  customSeed?: boolean
  seed?: number
  negativePrompt?: string
}

interface GenerationSettingsProps {
  settings: GenerationSettings
  onSettingsChange: (settings: GenerationSettings) => void
}

export function GenerationSettingsButton({ settings, onSettingsChange }: GenerationSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localSettings, setLocalSettings] = useState<GenerationSettings>(settings)

  const handleChange = (changes: Partial<GenerationSettings>) => {
    const newSettings = { ...localSettings, ...changes }
    setLocalSettings(newSettings)
    onSettingsChange(newSettings)
  }

  return (
    <div className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full flex items-center justify-between gap-2 h-10 text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <div className="flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Advanced Settings
            </div>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-4">
          <div className="grid gap-6 p-6 border rounded-lg bg-card shadow-sm">
            <TooltipProvider>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wand2 className="h-4 w-4 text-primary" />
                    <Label htmlFor="enhance-prompt" className="text-sm font-medium">
                      Prompt Enhancement
                    </Label>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Switch
                        id="enhance-prompt"
                        checked={localSettings.enablePromptEnhancement}
                        onCheckedChange={(checked) => handleChange({ enablePromptEnhancement: checked })}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Automatically enhance your prompts for better results</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Seedling className="h-4 w-4 text-primary" />
                      <Label htmlFor="custom-seed" className="text-sm font-medium">
                        Custom Seed
                      </Label>
                    </div>
                    <Switch
                      id="custom-seed"
                      checked={localSettings.customSeed}
                      onCheckedChange={(checked) =>
                        handleChange({
                          customSeed: checked,
                          seed: checked ? Math.floor(Math.random() * 1000000) : undefined,
                        })
                      }
                    />
                  </div>
                  {localSettings.customSeed && (
                    <Input
                      id="seed"
                      type="number"
                      value={localSettings.seed}
                      onChange={(e) => handleChange({ seed: Number.parseInt(e.target.value) || 0 })}
                      placeholder="Enter seed number"
                      className="h-9 mt-2"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-primary" />
                    <Label htmlFor="negative-prompt" className="text-sm font-medium">
                      Negative Prompt
                    </Label>
                  </div>
                  <Textarea
                    id="negative-prompt"
                    value={localSettings.negativePrompt}
                    onChange={(e) => handleChange({ negativePrompt: e.target.value })}
                    placeholder="Enter negative prompts (e.g., 'blurry, low quality')"
                    className="h-20 resize-none text-sm"
                  />
                </div>
              </div>
            </TooltipProvider>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

