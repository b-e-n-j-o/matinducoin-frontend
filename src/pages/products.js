import Products from '../components/Products';
import styles from '../styles/Products.module.css'; // Importer le fichier CSS spécifique

export default function ProductsPage() {
  return (
    <div className={styles.pageContainer}> {/* Ajouter une classe CSS */}
      <Products />
    </div>
  );
}
