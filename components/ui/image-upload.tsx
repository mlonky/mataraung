
"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, ImageIcon } from "lucide-react"
import Image from "next/image"
import { uploadImage, deleteImage } from "@/lib/supabase"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove: () => void
  folder?: string
  label?: string
  disabled?: boolean
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  folder = "",
  label = "Upload Image",
  disabled = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB")
      return
    }

    setUploading(true)

    try {
      const { url, error } = await uploadImage(file, folder)

      if (error) {
        alert(`Upload failed: ${error}`)
        return
      }

      if (url) {
        onChange(url)
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleRemove = async () => {
    if (value) {
      // Optionally delete from storage
      await deleteImage(value)
      onRemove()
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {value ? (
        <div className="relative">
          <div className="relative w-full h-48 border rounded-lg overflow-hidden">
            <Image src={value || "/placeholder.svg"} alt="Uploaded image" fill className="object-cover" />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemove}
            disabled={disabled || uploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${dragActive ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-gray-400"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center space-y-2">
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            ) : (
              <ImageIcon className="h-8 w-8 text-gray-400" />
            )}
            <div className="text-sm text-gray-600">
              {uploading ? (
                "Uploading..."
              ) : (
                <>
                  <span className="font-medium">Click to upload</span> or drag and drop
                  <br />
                  PNG, JPG, GIF up to 5MB
                </>
              )}
            </div>
          </div>

          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled || uploading}
          />
        </div>
      )}
    </div>
  )
}
