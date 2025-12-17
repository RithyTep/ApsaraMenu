import { useNode } from "@craftjs/core"

import type { HeaderBlockProps } from "@/components/menu-editor/blocks/header-block"
import SideSection from "@/components/menu-editor/side-section"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export default function HeaderSettings() {
  const {
    actions: { setProp },
    layout,
    showBanner,
    showLogo,
    showAddress,
    showSocialMedia
  } = useNode(node => ({
    layout: node.data.props.layout,
    accentColor: node.data.props.accentColor,
    showBanner: node.data.props.showBanner,
    showLogo: node.data.props.showLogo,
    showAddress: node.data.props.showAddress,
    showSocialMedia: node.data.props.showSocialMedia
  }))
  return (
    <>
      <SideSection title="Layout">
        <Select
          value={layout}
          onValueChange={value =>
            setProp(
              (props: HeaderBlockProps) =>
                (props.layout = value as "classic" | "modern")
            )
          }
        >
          <SelectTrigger className="focus:ring-transparent sm:h-7! sm:text-xs">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="classic">Classic</SelectItem>
            <SelectItem value="modern">Modern</SelectItem>
          </SelectContent>
        </Select>
      </SideSection>
      <SideSection title="Images">
        <div className="grid grid-cols-2 items-center gap-y-2">
          <dt>
            <Label size="xs">Logo</Label>
          </dt>
          <dd className="flex items-center">
            <Switch
              className="sm:scale-75"
              checked={showLogo}
              onCheckedChange={checked => {
                setProp(
                  (props: Required<HeaderBlockProps>) =>
                    (props.showLogo = checked)
                )
              }}
            />
          </dd>
          <dt>
            <Label size="xs">Cover</Label>
          </dt>
          <dd className="flex items-center">
            <Switch
              className="sm:scale-75"
              checked={showBanner}
              onCheckedChange={checked => {
                setProp(
                  (props: Required<HeaderBlockProps>) =>
                    (props.showBanner = checked)
                )
              }}
            />
          </dd>
        </div>
      </SideSection>
      <SideSection title="Business">
        <div className="grid grid-cols-2 items-center gap-y-2">
          <dt>
            <Label size="xs">Business data</Label>
          </dt>
          <dd className="flex items-center">
            <Switch
              className="sm:scale-75"
              checked={showAddress}
              onCheckedChange={checked => {
                setProp(
                  (props: Required<HeaderBlockProps>) =>
                    (props.showAddress = checked)
                )
              }}
            />
          </dd>
          <dt>
            <Label size="xs">Social media</Label>
          </dt>
          <dd className="flex items-center">
            <Switch
              className="sm:scale-75"
              checked={showSocialMedia}
              onCheckedChange={checked => {
                setProp(
                  (props: Required<HeaderBlockProps>) =>
                    (props.showSocialMedia = checked)
                )
              }}
            />
          </dd>
        </div>
      </SideSection>
    </>
  )
}
