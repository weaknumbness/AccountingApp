import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";
import { auth, db } from "./firebase";
import Authorization from "./Layouts/Authorization";
import { ref, set, onValue } from "firebase/database";
import "./Style/Reset.css"
import "./Style/app.css"
import Header from "./Layouts/Header";
import Category from "./Components/Category";
import AddCategory from "./Components/AddCategory";
import EditCard from "./Components/EditCard";
import { div } from "framer-motion/client";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {

    if (!user) return;

    const uid = user.uid;

    const categoryRef = ref(db, `users/${uid}/categories`);
    const cardsRef = ref(db, `users/${uid}/cards`);

    const unsubscribeCategories = onValue(categoryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setCategoryOfCards(Object.keys(data));
      else setCategoryOfCards([]);
    });

    const unsubscribeCards = onValue(cardsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const loadedCards = Object.keys(data).map(key => ({
          key,
          ...data[key]
        }));
        setProductCards(loadedCards);
      } else {
        setProductCards([]);
      }
    });

    return () => {
      unsubscribeCategories();
      unsubscribeCards();
    };

  }, [user]);

  const [categoryOfCards, setCategoryOfCards] = useState([]);
  const [productCards, setProductCards] = useState([]);

  const [isAddCategoryFormOpen, setIsAddFormCategoryOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const logOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Пользователь вышел");
      })
      .catch((error) => {
        console.log(error);
      });
  }


  const handleAddCard = (name, price, stock, profit, category) => {
    const uid = auth.currentUser.uid;

    const key = crypto.randomUUID();
    const newCard = { key, name, price, stock, profit, category };

    setProductCards(prev => [...prev, newCard]);

    set(ref(db, `users/${uid}/cards/${key}`), newCard);
  };

  const handleDeleteCard = (cardId) => {

    const uid = auth.currentUser.uid;

    setProductCards(prev => prev.filter(card => card.key !== cardId));

    set(ref(db, `users/${uid}/cards/${cardId}`), null);
  };

  const handleAddCategory = (category) => {

    const uid = auth.currentUser.uid;

    setCategoryOfCards(prev => [...prev, category]);

    set(ref(db, `users/${uid}/categories/${category}`), true);
  };

  const handleDeleteCategory = (category) => {

    const uid = auth.currentUser.uid;

    setCategoryOfCards(prev => prev.filter(c => c !== category));

    set(ref(db, `users/${uid}/categories/${category}`), null);

    productCards.forEach(card => {
      if (card.category === category) {
        set(ref(db, `users/${uid}/cards/${card.key}`), null);
      }
    });
  };

  const handleSell = (productKey, price) => {

    const uid = auth.currentUser.uid;

    setProductCards(prev =>
      prev.map(card => {

        if (card.key !== productKey) return card;
        if (card.stock <= 0) return card;

        const updatedCard = {
          ...card,
          stock: card.stock - 1,
          profit: card.profit + price
        };

        set(ref(db, `users/${uid}/cards/${productKey}`), updatedCard);

        return updatedCard;
      })
    );
  };

  const handleEditCard = (id, name, price, stock, profit) => {

    const uid = auth.currentUser.uid;

    setProductCards(prev =>
      prev.map(card => {

        if (card.key !== id) return card;

        const updatedCard = { ...card, name, price, stock, profit };

        set(ref(db, `users/${uid}/cards/${id}`), updatedCard);

        return updatedCard;
      })
    );
  };
  if (loading) return <div class="loader">
    Загрузка
  </div>;

  if (!user) return <Authorization />;

  return <div className="App">
    <Header openCb={() => setIsAddFormCategoryOpen(true)} logOut={logOut} />
    <div className="container">
      {categoryOfCards.map((e) =>
        <Category
          key={e}
          categoryName={e}
          deleteCb={handleDeleteCard}
          handleSubmit={handleAddCard}
          cards={productCards}
          addFormOpenCb={() => setActiveCategory(e)}
          isOpen={activeCategory === e}
          cb={() => setActiveCategory(null)}
          sellCb={handleSell}
          setEditingCard={setEditingCard}
          deleteCategory={handleDeleteCategory}
        />
      )}
      <AddCategory handleSubmit={handleAddCategory} isOpen={isAddCategoryFormOpen} hideCb={() => setIsAddFormCategoryOpen(false)} />
      <EditCard
        card={editingCard}
        isOpen={editingCard !== null}
        cb={() => setEditingCard(null)}
        handleSubmit={handleEditCard}
      />
    </div>
  </div>
}
