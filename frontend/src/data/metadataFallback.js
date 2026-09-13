// Use the same source as the Express API so offline fallback cannot drift from it.
import metadata from '../../../backend/data/algorithmsMetadata.json';

export const fallbackMetadata = metadata;
