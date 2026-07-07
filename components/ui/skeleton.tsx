import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-[#9f9fa94d] dark:bg-accent rounded-lg animate-pulse', className)}
      {...props}
    />
  )
}

export { Skeleton }
