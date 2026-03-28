import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { DepartmentTag } from './department-tag'
import { getDepartments } from '@/lib/api'
import { useMediaQuery } from '@/hooks/use-media-query'

export function DepartmentFilter() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeDeptId = Number(searchParams.get('dept') ?? 0)
  const isMobile = useMediaQuery('(max-width: 767px)')

  const { data: departments } = useQuery({
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

  const allDepts = [
    { departmentId: 0, displayName: 'All' },
    ...(departments ?? []),
  ]

  return (
    <div
      role="group"
      aria-label="Department filters"
      className="px-8 pb-8 max-md:px-4 max-md:pb-6"
    >
      <div
        className={
          isMobile
            ? 'flex gap-2 overflow-x-auto scrollbar-none [mask-image:linear-gradient(to_right,black_calc(100%-32px),transparent)]'
            : 'flex flex-wrap gap-2'
        }
      >
        {allDepts.map((dept) => (
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
