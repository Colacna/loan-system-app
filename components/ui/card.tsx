export function Card({ children }: any) {
  return <div className='border rounded shadow'>{children}</div>;
}
export function CardContent({ children, className }: any) {
  return <div className={className}>{children}</div>;
}
