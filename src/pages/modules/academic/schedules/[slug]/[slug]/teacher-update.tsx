import UserDrawer from '@/components/user-drawer'
import { api } from '@/lib/api'
import { SectionCourse } from '@/types/academic/section-course'
import { Avatar, Spinner } from '@fluentui/react-components'
import { PersonAddRegular } from '@fluentui/react-icons'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'anni'

type Props = {
  item: SectionCourse
  refetch: () => void
}
export default function TeacherUpdate({ item, refetch }: Props) {
  const { mutate: asignTeacher, isPending: isAsigning } = useMutation({
    mutationFn: (data: object) =>
      api.post(`academic/sections/courses/${item.id}`, {
        data: JSON.stringify(data),
        alreadyHandleError: false
      }),
    onSuccess: () => {
      refetch()
      toast.info('Docente actualizado correctamente')
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return (
    <>
      <UserDrawer
        onSubmit={(users) => {
          asignTeacher({
            teacherId: users[0]?.id
          })
        }}
        onlyTeachers
        max={1}
        onSubmitTitle={item.teacher ? 'Actualizar' : 'Asignar'}
        title={item ? 'Actualizar docente' : 'Asignar docente'}
        users={item.teacher ? [item.teacher] : []}
        triggerProps={{
          icon: isAsigning ? (
            <Spinner size="tiny" />
          ) : item.teacher ? (
            <Avatar
              image={{
                src: item.teacher.photoURL
              }}
              size={20}
              color="colorful"
              name={item.teacher.displayName}
            />
          ) : (
            <PersonAddRegular fontSize={16} />
          ),
          children: item.teacher ? item.teacher?.displayName : 'Sin docente',
          size: 'small',
          appearance: 'secondary',
          className: '!px-1 !text-left !text-nowrap'
        }}
      />
    </>
  )
}
