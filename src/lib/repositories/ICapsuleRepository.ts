import {
  Letter,
  CreateLetterInput,
  UpdateRealityInput,
  StampCategoryResponse,
  StampItemResponse,
  StampDetailResponse,
  StampFilters,
  InspirationCategoryResponse,
  InspirationItemResponse,
  InspirationDetailResponse,
  InspirationFilters,
} from "@/types/timeecho";

export interface ICapsuleRepository {
  getAll(params?: { status?: string; page?: number }): Promise<Letter[]>;
  getById(id: string): Promise<Letter | null>;
  create(input: CreateLetterInput): Promise<Letter>;
  updateReality(input: UpdateRealityInput): Promise<Letter>;
  archive(id: string): Promise<Letter>;
  restore(id: string): Promise<Letter>;
  delete(id: string): Promise<void>;
  getStamps?(
    locale?: string,
    filters?: StampFilters,
  ): Promise<StampItemResponse[]>;
  getStampCategories?(locale?: string): Promise<StampCategoryResponse[]>;
  getStampBySlug?(
    slug: string,
    locale?: string,
  ): Promise<StampDetailResponse | null>;
  getInspirations?(
    locale?: string,
    filters?: InspirationFilters,
  ): Promise<InspirationItemResponse[]>;
  getInspirationCategories?(
    locale?: string,
  ): Promise<InspirationCategoryResponse[]>;
  getInspirationBySlug?(
    slug: string,
    locale?: string,
  ): Promise<InspirationDetailResponse | null>;
}
