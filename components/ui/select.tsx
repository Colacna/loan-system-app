export function Select({ value, onValueChange, children }: any) {
  return <select value={value} onChange={(e) => onValueChange(e.target.value)} className='border rounded px-2 py-1 w-full'>{children}</select>;
}
export function SelectItem({ value, children, disabled }: any) {
  return <option value={value} disabled={disabled}>{children}</option>;
}
