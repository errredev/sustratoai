"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { ProCard } from '@/components/ui/pro-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Mail, User, Lock, AlertCircle, Info, CheckCircle, CreditCard, Calendar } from "lucide-react"
import { Text } from "@/components/ui/text"
import { ThemeSwitcher } from "@/components/ui/theme-switcher"
import { FontThemeSwitcher } from "@/components/ui/font-theme-switcher"
import { Divider } from "@/components/ui/divider"

export default function ShowroomInput() {
  const [values, setValues] = useState({
    default: "",
    withIcon: "",
    withError: "Error example",
    withSuccess: "Success example",
    withHint: "",
    withCounter: "",
    disabled: "Disabled input",
    clearable: "Clear me",
  })

  const handleChange = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [key]: e.target.value }))
  }

  const handleClear = (key: keyof typeof values) => () => {
    setValues((prev) => ({ ...prev, [key]: "" }))
  }

  const variants = ["default", "primary", "secondary", "tertiary", "accent", "neutral"] as const
  const sizes = ["sm", "md", "lg"] as const

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <Text variant="heading">Input Showroom</Text>
        <div className="flex gap-4">
          <ThemeSwitcher />
          <FontThemeSwitcher />
        </div>
      </div>

      <Tabs defaultValue="variants">
        <TabsList className="mb-4">
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="sizes">Sizes</TabsTrigger>
          <TabsTrigger value="states">States</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="variants">
          <ProCard>
            <ProCard.Header>
              <ProCard.Title>Input Variants</ProCard.Title>
              <Text variant="description">Different visual styles for the Input component</Text>
            </ProCard.Header>
            <ProCard.Content className="grid gap-6">
              {variants.map((variant) => (
                <div key={variant} className="space-y-2">
                  <Text variant="label" className="capitalize">
                    {variant}
                  </Text>
                  <Input
                    variant={variant}
                    placeholder={`${variant} input`}
                    value={values.default}
                    onChange={handleChange("default")}
                  />
                </div>
              ))}
            </ProCard.Content>
          </ProCard>
        </TabsContent>

        <TabsContent value="sizes">
          <ProCard>
            <ProCard.Header>
              <ProCard.Title>Input Sizes</ProCard.Title>
              <Text variant="description">Different size options for the Input component</Text>
            </ProCard.Header>
            <ProCard.Content className="grid gap-6">
              {sizes.map((size) => (
                <div key={size} className="space-y-2">
                  <Text variant="label" className="capitalize">
                    {size}
                  </Text>
                  <Input
                    size={size}
                    placeholder={`${size} input`}
                    value={values.default}
                    onChange={handleChange("default")}
                  />
                </div>
              ))}

              <Divider />

              <Text variant="subtitle">With Icons</Text>
              <div className="grid gap-6">
                {sizes.map((size) => (
                  <div key={`${size}-icon`} className="space-y-2">
                    <Text variant="label" className="capitalize">
                      {size} with icons
                    </Text>
                    <Input
                      size={size}
                      placeholder={`${size} input with icons`}
                      value={values.withIcon}
                      onChange={handleChange("withIcon")}
                      leadingIcon={Search}
                      trailingIcon={Info}
                    />
                  </div>
                ))}
              </div>
            </ProCard.Content>
          </ProCard>
        </TabsContent>

        <TabsContent value="states">
          <ProCard>
            <ProCard.Header>
              <ProCard.Title>Input States</ProCard.Title>
              <Text variant="description">Different states of the Input component</Text>
            </ProCard.Header>
            <ProCard.Content className="grid gap-6">
              <div className="space-y-2">
                <Text variant="label">Default</Text>
                <Input placeholder="Default input" value={values.default} onChange={handleChange("default")} />
              </div>

              <div className="space-y-2">
                <Text variant="label">With Error</Text>
                <Input
                  placeholder="Input with error"
                  value={values.withError}
                  onChange={handleChange("withError")}
                  error="This field has an error"
                />
              </div>

              <div className="space-y-2">
                <Text variant="label">With Success</Text>
                <Input
                  placeholder="Input with success"
                  value={values.withSuccess}
                  onChange={handleChange("withSuccess")}
                  success
                  successMessage="This field is valid"
                />
              </div>

              <div className="space-y-2">
                <Text variant="label">With Hint</Text>
                <Input
                  placeholder="Input with hint"
                  value={values.withHint}
                  onChange={handleChange("withHint")}
                  hint="This is a helpful hint"
                />
              </div>

              <div className="space-y-2">
                <Text variant="label">Disabled</Text>
                <Input
                  placeholder="Disabled input"
                  value={values.disabled}
                  onChange={handleChange("disabled")}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Text variant="label">Disabled with Icon</Text>
                <Input
                  placeholder="Disabled input with icon"
                  value={values.disabled}
                  onChange={handleChange("disabled")}
                  disabled
                  leadingIcon={Lock}
                />
              </div>

              <div className="space-y-2">
                <Text variant="label">Is Editing</Text>
                <Input
                  placeholder="Input in editing mode"
                  value={values.default}
                  onChange={handleChange("default")}
                  isEditing
                />
              </div>
            </ProCard.Content>
          </ProCard>
        </TabsContent>

        <TabsContent value="examples">
          <ProCard>
            <ProCard.Header>
              <ProCard.Title>Input Examples</ProCard.Title>
              <Text variant="description">Common use cases for the Input component</Text>
            </ProCard.Header>
            <ProCard.Content className="grid gap-6">
              <div className="space-y-2">
                <Text variant="label">With Leading Icon</Text>
                <Input
                  placeholder="Search..."
                  value={values.withIcon}
                  onChange={handleChange("withIcon")}
                  leadingIcon={Search}
                />
              </div>

              <div className="space-y-2">
                <Text variant="label">With Trailing Icon</Text>
                <Input
                  placeholder="Enter information"
                  value={values.withIcon}
                  onChange={handleChange("withIcon")}
                  trailingIcon={Info}
                />
              </div>

              <div className="space-y-2">
                <Text variant="label">With Character Count</Text>
                <Input
                  placeholder="Limited to 50 characters"
                  value={values.withCounter}
                  onChange={handleChange("withCounter")}
                  maxLength={50}
                  showCharacterCount
                />
              </div>

              <div className="space-y-2">
                <Text variant="label">Clearable Input</Text>
                <Input
                  placeholder="Type something..."
                  value={values.clearable}
                  onChange={handleChange("clearable")}
                  onClear={handleClear("clearable")}
                />
              </div>

              <Divider />

              <Text variant="subtitle">Form Examples</Text>

              <div className="space-y-2">
                <Text variant="label">Email Input</Text>
                <Input type="email" placeholder="Enter your email" leadingIcon={Mail} />
              </div>

              <div className="space-y-2">
                <Text variant="label">Username Input</Text>
                <Input placeholder="Enter username" leadingIcon={User} />
              </div>

              <div className="space-y-2">
                <Text variant="label">Password Input</Text>
                <Input type="password" placeholder="Enter password" leadingIcon={Lock} />
              </div>

              <div className="space-y-2">
                <Text variant="label">Error with Icon</Text>
                <Input
                  placeholder="Invalid input"
                  value="Invalid value"
                  error="This field is required"
                  leadingIcon={AlertCircle}
                />
              </div>

              <div className="space-y-2">
                <Text variant="label">Success with Icon</Text>
                <Input
                  placeholder="Valid input"
                  value="Valid value"
                  success
                  successMessage="This field is valid"
                  leadingIcon={CheckCircle}
                />
              </div>

              <div className="space-y-2">
                <Text variant="label">Credit Card Input</Text>
                <Input placeholder="1234 5678 9012 3456" leadingIcon={CreditCard} variant="primary" />
              </div>

              <div className="space-y-2">
                <Text variant="label">Date Input</Text>
                <Input type="date" leadingIcon={Calendar} variant="secondary" />
              </div>
            </ProCard.Content>
          </ProCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}
