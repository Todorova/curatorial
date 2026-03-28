import { useSearchParams } from 'react-router-dom'
import { DepartmentTag } from './department-tag'
import { DEPARTMENTS } from '@/lib/constants'
import { useMediaQuery } from '@/hooks/use-media-query'

export function DepartmentFilter() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeDeptId = Number(searchParams.get('dept') ?? 0)
  const isMobile = useMediaQuery('(max-width: 767px)')

  const handleSelect = (departmentId: number) => {
    setSearchParams((prev) => {
      if (departmentId === 0) {
        prev.delete('dept')
      } else {
        prev.set('dept', String(departmentId))
      }
      prev.delete('page')
      return prev
    })
  }

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
        {DEPARTMENTS.map((dept) => (
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
