"use client"

import type React from "react"

// Adapted from: https://github.com/shadcn-ui/ui/blob/main/apps/www/registry/default/ui/use-toast.ts
import { useState, useEffect, useCallback } from "react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000

type ToastProps = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const dismiss = useCallback((toastId?: string) => {
    setToasts((toasts) => {
      if (toastId) {
        return toasts.map((toast) => {
          if (toast.id === toastId) {
            return {
              ...toast,
              open: false,
            }
          }
          return toast
        })
      }
      return toasts.map((toast) => ({
        ...toast,
        open: false,
      }))
    })
  }, [])

  const toast = useCallback(
    ({ ...props }: Omit<ToastProps, "id">) => {
      const id = genId()

      setToasts((toasts) =>
        [
          {
            ...props,
            id,
            open: true,
          },
          ...toasts,
        ].slice(0, TOAST_LIMIT),
      )

      return {
        id,
        dismiss: () => dismiss(id),
        update: (props: ToastProps) => setToasts((toasts) => toasts.map((t) => (t.id === id ? { ...t, ...props } : t))),
      }
    },
    [dismiss],
  )

  useEffect(() => {
    const timeouts = new Map<string, ReturnType<typeof setTimeout>>()

    toasts
      .filter((toast) => toast.open === false)
      .forEach((toast) => {
        if (!timeouts.has(toast.id)) {
          timeouts.set(
            toast.id,
            setTimeout(() => {
              setToasts((toasts) => toasts.filter((t) => t.id !== toast.id))
              timeouts.delete(toast.id)
            }, TOAST_REMOVE_DELAY),
          )
        }
      })

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
    }
  }, [toasts])

  return {
    toast,
    dismiss,
    toasts,
  }
}

