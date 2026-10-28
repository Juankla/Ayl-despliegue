// backend/routes/backup.js
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const router = express.Router();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const webhookUrl = process.env.GOOGLE_DRIVE_WEBHOOK_URL;

const supabase = createClient(supabaseUrl, supabaseKey);

const tablas = [
  'bodega',
  'carrito',
  'carrito_item',
  'favoritos',
  'notificaciones_stock',
  'orden',
  'orden_item',
  'producto_bodega',
  'productos',
  'resenas_producto',
  'reserva',
  'stock_movimiento',
  'usuario'
];

// ✅ EXPORT CON NOMBRE PARA SERVER.JS
export async function ejecutarCopiaSeguridad() {
  const respaldoCompleto = {
    fecha: new Date().toISOString(),
    sistema: 'A&L Compresores y Partes',
    tablas: {}
  };

  for (const tabla of tablas) {
    try {
      const { data, error } = await supabase.from(tabla).select('*');
      respaldoCompleto.tablas[tabla] = error ? { error: error.message } : data;
    } catch (err) {
      respaldoCompleto.tablas[tabla] = { error: err.message };
    }
  }

  if (!webhookUrl) {
    throw new Error('No está configurada la variable GOOGLE_DRIVE_WEBHOOK_URL en el .env');
  }

  const respuestaDrive = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(respaldoCompleto),
    redirect: 'follow'
  });

  const resultado = await respuestaDrive.json();
  if (resultado.status !== 'success') {
    throw new Error(resultado.message || 'Error desconocido devuelto por Google Drive');
  }

  return resultado;
}

// ✅ RUTA POST PARA EL BOTÓN EN REACT
router.post('/generar-respaldo-drive', async (req, res) => {
  try {
    const resultado = await ejecutarCopiaSeguridad();
    return res.json({
      success: true,
      message: 'Respaldo guardado exitosamente en Google Drive',
      fileName: resultado.fileName
    });
  } catch (err) {
    console.error('Error en /api/backup/generar-respaldo-drive:', err.message);
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;