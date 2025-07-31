

export const getNetColorClass = (color: string): string => {
  switch (color) {
    case 'red': return 'text-red-600'
    case 'blue': return 'text-blue-600'
    case 'green': return 'text-green-600'
    case 'yellow': return 'text-yellow-600'
    default: return 'text-gray-600'
  }
}

export const getNetColorBgClass = (color: string): string => {
  switch (color) {
    case 'red': return 'bg-red-100 text-red-800'
    case 'blue': return 'bg-blue-100 text-blue-800'
    case 'green': return 'bg-green-100 text-green-800'
    case 'yellow': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export const getCourtBackgroundClass = (netColor: string): string => {
  switch (netColor) {
    case 'red': return 'bg-gradient-to-br from-red-50 to-pink-100 border border-red-200'
    case 'blue': return 'bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200'
    case 'green': return 'bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200'
    case 'yellow': return 'bg-gradient-to-br from-yellow-50 to-amber-100 border border-yellow-200'
    default: return 'bg-white border border-gray-200'
  }
}

export const getCourtTextClass = (netColor: string): string => {
  switch (netColor) {
    case 'red': return 'text-red-900'
    case 'blue': return 'text-blue-900'
    case 'green': return 'text-green-900'
    case 'yellow': return 'text-yellow-900'
    default: return 'text-gray-900'
  }
}

export const getTeam1ColorClass = (netColor: string): string => {
  switch (netColor) {
    case 'red': return 'text-red-600'
    case 'blue': return 'text-blue-600'
    case 'green': return 'text-green-600'
    case 'yellow': return 'text-yellow-600'
    default: return 'text-gray-600'
  }
}

export const getTeam1BorderClass = (netColor: string): string => {
  switch (netColor) {
    case 'red': return 'border-red-200'
    case 'blue': return 'border-blue-200'
    case 'green': return 'border-green-200'
    case 'yellow': return 'border-yellow-200'
    default: return 'border-gray-200'
  }
}

export const getTeam1AccentClass = (netColor: string): string => {
  switch (netColor) {
    case 'red': return 'bg-red-100 text-red-800'
    case 'blue': return 'bg-blue-100 text-blue-800'
    case 'green': return 'bg-green-100 text-green-800'
    case 'yellow': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export const getTeam2ColorClass = (netColor: string): string => {
  switch (netColor) {
    case 'red': return 'text-red-600'
    case 'blue': return 'text-blue-600'
    case 'green': return 'text-green-600'
    case 'yellow': return 'text-yellow-600'
    default: return 'text-gray-600'
  }
}

export const getTeam2BorderClass = (netColor: string): string => {
  switch (netColor) {
    case 'red': return 'border-red-200'
    case 'blue': return 'border-blue-200'
    case 'green': return 'border-green-200'
    case 'yellow': return 'border-yellow-200'
    default: return 'border-gray-200'
  }
}

export const getTeam2AccentClass = (netColor: string): string => {
  switch (netColor) {
    case 'red': return 'bg-red-100 text-red-800'
    case 'blue': return 'bg-blue-100 text-blue-800'
    case 'green': return 'bg-green-100 text-green-800'
    case 'yellow': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export const getNetColorBorderClass = (color: string): string => {
  switch (color) {
    case 'red': return 'border-red-300'
    case 'blue': return 'border-blue-300'
    case 'green': return 'border-green-300'
    case 'yellow': return 'border-yellow-300'
    default: return 'border-gray-300'
  }
}

export const getNetColorFocusClass = (color: string): string => {
  switch (color) {
    case 'red': return 'focus:ring-red-500 focus:border-red-500'
    case 'blue': return 'focus:ring-blue-500 focus:border-blue-500'
    case 'green': return 'focus:ring-green-500 focus:border-green-500'
    case 'yellow': return 'focus:ring-yellow-500 focus:border-yellow-500'
    default: return 'focus:ring-gray-500 focus:border-gray-500'
  }
} 