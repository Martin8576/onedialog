import marcLobinger from '../assets/users/marc_lobinger.jpg'
import felixLugner from '../assets/users/felix_lugner.jpg'
import nadjaSchwarz from '../assets/users/nadja_schwarz.jpg'
import brittaDrechsler from '../assets/users/britta_drechsler.jpg'
import peterWollner from '../assets/users/peter_wollner.jpg'

export type User = {
  id: string
  name: string
  img: string
}

export const users: User[] = [
  { id: 'marc', name: 'Marc Lobinger', img: marcLobinger },
  { id: 'felix', name: 'Felix Lugner', img: felixLugner },
  { id: 'nadja', name: 'Nadja Schwarz', img: nadjaSchwarz },
  { id: 'britta', name: 'Britta Drechsler', img: brittaDrechsler },
  { id: 'peter', name: 'Peter Wollner', img: peterWollner },
]

export function getUserByName(name: string): User | undefined {
  return users.find(u => u.name === name)
}
