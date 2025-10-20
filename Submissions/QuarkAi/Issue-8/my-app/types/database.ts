export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'admin' | 'cashier'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: UserRole
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          sku: string
          category: string
          price: number
          cost_price: number
          quantity: number
          low_stock_threshold: number
          barcode: string | null
          description: string | null
          image_url: string | null
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          name: string
          sku: string
          category: string
          price: number
          cost_price: number
          quantity?: number
          low_stock_threshold?: number
          barcode?: string | null
          description?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          name?: string
          sku?: string
          category?: string
          price?: number
          cost_price?: number
          quantity?: number
          low_stock_threshold?: number
          barcode?: string | null
          description?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
      invoices: {
        Row: {
          id: string
          invoice_number: string
          customer_name: string | null
          customer_phone: string | null
          total_amount: number
          total_profit: number
          payment_method: string
          status: 'completed' | 'pending' | 'cancelled'
          notes: string | null
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          invoice_number: string
          customer_name?: string | null
          customer_phone?: string | null
          total_amount: number
          total_profit: number
          payment_method?: string
          status?: 'completed' | 'pending' | 'cancelled'
          notes?: string | null
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          invoice_number?: string
          customer_name?: string | null
          customer_phone?: string | null
          total_amount?: number
          total_profit?: number
          payment_method?: string
          status?: 'completed' | 'pending' | 'cancelled'
          notes?: string | null
          created_at?: string
          created_by?: string
        }
      }
      invoice_items: {
        Row: {
          id: string
          invoice_id: string
          product_id: string
          product_name: string
          quantity: number
          unit_price: number
          unit_cost: number
          subtotal: number
          profit: number
          created_at: string
        }
        Insert: {
          id?: string
          invoice_id: string
          product_id: string
          product_name: string
          quantity: number
          unit_price: number
          unit_cost: number
          subtotal: number
          profit: number
          created_at?: string
        }
        Update: {
          id?: string
          invoice_id?: string
          product_id?: string
          product_name?: string
          quantity?: number
          unit_price?: number
          unit_cost?: number
          subtotal?: number
          profit?: number
          created_at?: string
        }
      }
    }
  }
}
