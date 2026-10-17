// A continuous stretch of physical track, shared by one or more lines.
//
// Lines that run together down the same street share one corridor rather than
// each carrying their own copy of the geometry: the map draws the corridor once
// per line, fanning them out into parallel lanes so the colours stay readable
// where several lines overlap.
export interface TrackCorridor {
  /** App line ids sharing this stretch, in lane order (left to right). */
  lines: string[];
  coords: [number, number][];
}
