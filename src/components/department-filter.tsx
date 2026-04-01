import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { DepartmentTag } from './department-tag'
import { Skeleton } from '@/components/ui/skeleton'
import { getDepartments } from '@/lib/api'

export function DepartmentFilter() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeDeptId = Number(searchParams.get('dept') ?? 0)

  const { data: departments, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: ({ signal }) => getDepartments(signal),
    staleTime: Infinity,
  })

  const handleSelect = (departmentId: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (departmentId === 0) {
        next.delete('dept')
      } else {
        next.set('dept', String(departmentId))
      }
      next.delete('page')
      return next
    })
  }

  return (
    <div
      role="group"
      aria-label="Department filters"
      className="px-8 pb-8 max-md:px-4 max-md:pb-6"
    >
      <div
        className="flex gap-2 overflow-x-auto scrollbar-none [mask-image:linear-gradient(to_right,black_calc(100%-32px),transparent)] md:flex-wrap md:overflow-x-visible md:[mask-image:none]"
      >
        <DepartmentTag
          label="All"
          isActive={activeDeptId === 0}
          onClick={() => handleSelect(0)}
        />
        {isLoading
          ? [16, 24, 20, 14, 22, 18, 16, 20].map((w, i) => (
              <Skeleton key={i} className={`h-[30px] shrink-0 rounded-sm`} style={{ width: `${w * 4}px` }} />
            ))
          : (departments ?? []).map((dept) => (
              <DepartmentTag
                key={dept.departmentId}
                label={dept.displayName}
                isActive={activeDeptId === dept.departmentId}
                onClick={() => handleSelect(dept.departmentId)}
              />
            ))}
      </div>
    </div>
  )
}
