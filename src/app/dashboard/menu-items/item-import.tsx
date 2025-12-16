"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import { AlertCircle, FileSpreadsheet, Loader, Upload } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import Papa from "papaparse"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { bulkCreateItems } from "@/server/actions/item/mutations"
import { MenuItemStatus, type BulkMenuItem } from "@/lib/types"

type CSVRow = {
  nombre: string
  descripcion?: string
  precio: string
  categoria?: string
  moneda?: string
}

type ImportError = {
  row: number
  errors: string[]
}

export default function ItemImport() {
  const [open, setOpen] = useState(false)
  const [errors, setErrors] = useState<ImportError[]>([])
  const { execute, isPending, reset } = useAction(bulkCreateItems, {
    onSuccess: response => {
      console.dir(response.data)
      if (response.data?.failure) {
        toast.error(response.data.failure.reason)
        return
      }
      toast.success(
        `${response.data?.success?.length} items imported successfully`
      )
      setOpen(false)
      reset()
    },
    onError: error => {
      console.error(error)
      toast.error("Error importing items")
      reset()
    }
  })

  const validateRow = (row: CSVRow, _index: number): string[] => {
    const errors: string[] = []

    if (!row.nombre?.trim()) {
      errors.push("Name is required")
    }

    if (!row.precio) {
      errors.push("Price is required")
    } else {
      const price = parseFloat(row.precio)
      if (isNaN(price) || price < 0) {
        errors.push("Price must be a positive number")
      }
    }

    if (row.moneda) {
      const m = row.moneda.trim().toUpperCase()
      if (!(m === "MXN" || m === "USD")) {
        errors.push("Invalid currency (use MXN or USD)")
      }
    }

    return errors
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setErrors([])

    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      encoding: "iso-8859-1",
      complete: results => {
        if (results.data.length === 0) {
          setErrors([{ row: 0, errors: ["File is empty"] }])
          return
        }

        if (results.data.length > 50) {
          setErrors([
            {
              row: 0,
              errors: ["You cannot import more than 50 items at once"]
            }
          ])
          return
        }

        const foundErrors: ImportError[] = []
        const validItems: BulkMenuItem[] = []

        results.data.forEach((row, index) => {
          const rowErrors = validateRow(row, index)
          if (rowErrors.length > 0) {
            foundErrors.push({
              row: index + 1,
              errors: rowErrors
            })
          } else {
            const currency = (row.moneda ?? "MXN").trim().toUpperCase()
            validItems.push({
              name: row.nombre,
              description: row.descripcion,
              price: parseFloat(row.precio),
              status: MenuItemStatus.ACTIVE,
              category: row.categoria,
              currency: currency === "USD" ? "USD" : "MXN"
            })
          }
        })

        if (foundErrors.length > 0) {
          setErrors(foundErrors)
          return
        }

        execute(validItems)
      },
      error: error => {
        setErrors([
          { row: 0, errors: [`Error processing file: ${error.message}`] }
        ])
      }
    })
  }

  const handleDownloadTemplate = () => {
    const template = [
      {
        nombre: "Sample item",
        descripcion: "Item description",
        precio: "100.00",
        categoria: "Category (optional)",
        moneda: "MXN"
      }
    ]

    const csv = Papa.unparse(template)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", "items-template.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <Button
        variant="secondary"
        className="gap-2"
        onClick={() => {
          setErrors([])
          setOpen(true)
        }}
      >
        {isPending ? (
          <Loader className="size-4 animate-spin" />
        ) : (
          <Upload className="size-4" />
        )}
        Import CSV
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import items from CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file with columns: nombre, descripcion (optional),
              precio, categoria (optional)
            </DialogDescription>
          </DialogHeader>

          <Button
            variant="link"
            className="mb-4 h-fit w-fit p-0 text-green-500 dark:text-green-400"
            onClick={handleDownloadTemplate}
          >
            <FileSpreadsheet className="mr-1" />
            Download sample CSV template
          </Button>

          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertTitle>File errors</AlertTitle>
              <AlertDescription>
                <ul className="list-inside list-disc">
                  {errors.map((error, i) => (
                    <li key={i}>
                      Row {error.row}: {error.errors.join(", ")}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold"
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
