export function MapPlaceholder() {
  return (
    <div className="space-y-3 rounded-xl border p-4">
      <div className="text-sm font-medium">Map placeholder</div>
      <p className="text-sm text-muted-foreground">
        This area will later allow manual location selection on a map.
      </p>

      <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed bg-muted/40 text-sm text-muted-foreground">
        Map placeholder
      </div>
    </div>
  );
}
