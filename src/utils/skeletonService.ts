
export interface SkeletonService {
  loading: boolean
  show: () => void
  hide: () => void
}

export const skeletonService: SkeletonService = reactive<SkeletonService>({
  loading: false,
  
  show: () => {
    skeletonService.loading = true
  },
  
  hide: () => {
    skeletonService.loading = false
  }
})