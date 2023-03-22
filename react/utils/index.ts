interface Category {
  id: number
  name: string
  hasChildren: boolean
  children: [Category]
}

export const findMatchingCategory = (
  categories: [Category],
  findId: string
) => {
  for (const cat of categories) {
    const result: any =
      String(cat.id) === String(findId)
        ? cat
        : cat.hasChildren && findMatchingCategory(cat.children, findId)

    if (result) {
      return result
    }
  }
}

export const getColorScheme = (color?: string) => {
  let background = ''
  let iconBackground = ''
  const fill = '#fff'

  switch (color) {
    case 'Dark Blue':
      background = '#143D5F'
      iconBackground = 'rgba(255, 255, 255, 0.1)'
      break

    case 'Green':
      background = '#00AC6C'
      iconBackground = 'rgba(0, 123, 77, 0.4)'
      break

    case 'Red':
      background = '#ED002E'
      iconBackground = '#D40029'
      break

    case 'Light Blue':
      background = '#29A7CD'
      iconBackground = '#1993B8'
      break

    case 'Yellow':
      background = '#E85410'
      iconBackground = 'rgba(204, 151, 0, 0.3)'
      break

    case 'Orange':
      background = '#F58A1F'
      iconBackground = '#F05E22'
      break

    default:
      background = '#143D5F'
      iconBackground = 'rgba(255, 255, 255, 0.1)'
      break
  }

  return { background, iconBackground, fill }
}
