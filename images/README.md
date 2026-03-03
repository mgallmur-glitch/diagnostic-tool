# Instrucciones para agregar la foto de Mauricio

## Paso 1: Guardar la foto
1. Guarda tu foto como `mauricio.jpg` en esta carpeta (`images/`)
2. La foto debe ser en formato JPG o PNG
3. Tamaño recomendado: 800x1000px o similar (proporción vertical)

## Paso 2: Commit y push
```bash
git add images/mauricio.jpg
git commit -m "Add Mauricio photo"
git push origin main
```

## Nota
Si la foto tiene otro nombre, actualiza la referencia en `index.html` línea donde dice:
```html
<img src="images/mauricio.jpg" alt="Mauricio Gallmur">
```
