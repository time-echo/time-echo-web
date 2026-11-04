import {
  Letter,
  CreateLetterInput,
  UpdateRealityInput,
  StampCategoryResponse,
  StampItemResponse,
  StampDetailResponse,
} from "@/types/timeecho";

/**
 * 🏛️ ICapsuleRepository
 *
 * Core interface contract for TimeEcho capsule data access (Adapter Pattern).
 * Decouples the UI layer, feature slices, and React context from the underlying
 * persistence mechanism (LocalStorage, IndexedDB, or future REST / GraphQL APIs).
 */
export interface ICapsuleRepository {
  /**
   * Retrieves all capsules from storage, ordered by creation or delivery schedule.
   */
  getAll(params?: { status?: string; page?: number }): Promise<Letter[]>;

  /**
   * Finds a specific capsule by its unique ID.
   * Returns null if not found.
   */
  getById(id: string): Promise<Letter | null>;

  /**
   * Creates and seals a new time-capsule letter.
   */
  create(input: CreateLetterInput): Promise<Letter>;

  /**
   * Updates retrospective reality evaluations and reveal emotions for an unlocked capsule.
   */
  updateReality(input: UpdateRealityInput): Promise<Letter>;

  /**
   * Marks a capsule as archived.
   */
  archive(id: string): Promise<Letter>;

  /**
   * Restores an archived capsule back to active status (opened or delivered).
   */
  restore(id: string): Promise<Letter>;
  delete(id: string): Promise<void>;

  /**
   * Retrieves active stamps catalog with optional filters and pagination.
   */
  getStamps?(
    locale?: string,
    filters?: import("@/types/timeecho").StampFilters,
  ): Promise<StampItemResponse[]>;

  /**
   * Retrieves active stamp categories that have active stamps.
   */
  getStampCategories?(locale?: string): Promise<StampCategoryResponse[]>;

  /**
   * Retrieves stamp details by slug (including inactive stamps for historical letters).
   */
  getStampBySlug?(
    slug: string,
    locale?: string,
  ): Promise<StampDetailResponse | null>;
}
