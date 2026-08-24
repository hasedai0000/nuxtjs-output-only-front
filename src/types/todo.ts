export type TodoId = number

export type TodoType = {
  id: TodoId
  title: string
  content: string
  created_at?: string
  updated_at?: string
}
