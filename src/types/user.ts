export interface User {
  id?: number;
  username: string;
  // Backend'den parola dönmüyorsa burada tanımlamayın (Güvenlik için)
  // Varsa diğer alanlar:
  // email?: string;
  // roles?: string[];
}