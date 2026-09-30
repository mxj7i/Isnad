import type {
  GenerationRequest,
  GenerationResponse,
} from "./types";

export interface GenerationProvider {
  generate(request: GenerationRequest): Promise<GenerationResponse>;
}