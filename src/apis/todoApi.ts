import type { AxiosResponse } from "axios";
import { globalAxios, isAxiosError } from "@/apis/config";
import type { TodoType } from "~/types/todo";

/**
 * Todoリスト取得のAPI接続処理
 * @returns
 */
export const fetchTodoListApi = async () => {
  try {
    const { data }: AxiosResponse<Array<TodoType>> = await globalAxios().get(
      "/todos"
    );
    return data;
  } catch (err) {
    if (isAxiosError(err)) {
      return err.code;
    }
  }
};

/**
 * idに紐づく単一のTodo取得のAPI接続処理
 * @param id
 * @returns
 */
export const fetchTodoDetailApi = async (id: number) => {
  try {
    const { data }: AxiosResponse<TodoType> = await globalAxios().get(
      `/todos/${id}`
    );
    return data;
  } catch (err) {
    if (isAxiosError(err)) {
      return err.code;
    }
  }
};
