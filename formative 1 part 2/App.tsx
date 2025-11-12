import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';

type CourseType = 'starter' | 'main' | 'dessert' | 'beverage';

interface MenuItem {
  id: string;
  name: string;
  course: CourseType;
  price: number;
  description: string;
}

export default function App() {
  // All the menu items stored in one array
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: '1', name: 'Burger', course: 'main', price: 50, description: 'Delicious grilled beef burger served on a fresh bun.' },
    { id: '2', name: 'Burger and Chips', course: 'main', price: 80, description: 'Classic beef burger served with crispy golden chips.' },
    { id: '3', name: 'Large Chips', course: 'starter', price: 70, description: 'Generous portion of hot and crispy chips.' },
    { id: '4', name: 'Burger Meal Combo', course: 'main', price: 120, description: 'Burger, large chips, and a drink combo.' },
    { id: '5', name: 'Soft Drink', course: 'beverage', price: 25, description: 'Refreshing cold beverage of your choice.' },
    { id: '6', name: 'Chocolate Milkshake', course: 'dessert', price: 45, description: 'Thick creamy milkshake with rich chocolate flavor.' }
  ]);

  // States for adding new items
  const [name, setName] = useState('');
  const [course, setCourse] = useState<CourseType>('main');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  // State to track which screen we are on
  const [screen, setScreen] = useState<'home' | 'add' | 'filter'>('home');

  // State for filtering
  const [filterCourse, setFilterCourse] = useState<CourseType | 'all'>('all');

  // Function to add new menu item
  const addMenuItem = () => {
    if (!name || !price) return;
    
    const newItem: MenuItem = {
      id: Math.random().toString(),
      name,
      course,
      price: Number(price),
      description
    };
    
    setMenuItems([...menuItems, newItem]);
    setName('');
    setPrice('');
    setDescription('');
    setScreen('home'); // Go back to home after adding
  };

  // Function to remove menu item using WHILE loop
  const removeMenuItem = (id: string) => {
    let i = 0;
    let found = false;
    
    // WHILE LOOP: Look for the item to remove
    while (i < menuItems.length && !found) {
      if (menuItems[i].id === id) {
        const newItems = [...menuItems];
        newItems.splice(i, 1);
        setMenuItems(newItems);
        found = true;
      }
      i++;
    }
  };

  // Function to calculate average prices using FOR loop
  const calculateAverages = () => {
    let starterTotal = 0;
    let starterCount = 0;
    let mainTotal = 0;
    let mainCount = 0;
    let dessertTotal = 0;
    let dessertCount = 0;
    let beverageTotal = 0;
    let beverageCount = 0;

    // FOR LOOP: Go through all menu items
    for (let i = 0; i < menuItems.length; i++) {
      const item = menuItems[i];
      
      if (item.course === 'starter') {
        starterTotal += item.price;
        starterCount++;
      } else if (item.course === 'main') {
        mainTotal += item.price;
        mainCount++;
      } else if (item.course === 'dessert') {
        dessertTotal += item.price;
        dessertCount++;
      } else if (item.course === 'beverage') {
        beverageTotal += item.price;
        beverageCount++;
      }
    }

    return {
      starter: starterCount > 0 ? Math.round(starterTotal / starterCount) : 0,
      main: mainCount > 0 ? Math.round(mainTotal / mainCount) : 0,
      dessert: dessertCount > 0 ? Math.round(dessertTotal / dessertCount) : 0,
      beverage: beverageCount > 0 ? Math.round(beverageTotal / beverageCount) : 0
    };
  };

  // Function to filter items using FOR loop
  const getFilteredItems = () => {
    if (filterCourse === 'all') return menuItems;
    
    const filtered = [];
    // FOR LOOP: Check each item
    for (let i = 0; i < menuItems.length; i++) {
      if (menuItems[i].course === filterCourse) {
        filtered.push(menuItems[i]);
      }
    }
    return filtered;
  };

  // Function using FOR...IN loop
  const showItemDetails = (item: MenuItem) => {
    let details = '';
    // FOR...IN LOOP: Go through each property
    for (const key in item) {
      details += `${key}: ${item[key as keyof MenuItem]}\n`;
    }
    return details;
  };

  const averages = calculateAverages();
  const filteredItems = getFilteredItems();

  // HOME SCREEN - Shows all items and average prices
  if (screen === 'home') {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Christoteffel Restaurant</Text>
        <Text style={styles.subHeader}>Total Items: {menuItems.length}</Text>

        {/* Average Prices Section */}
        <View style={styles.averageBox}>
          <Text style={styles.sectionTitle}>Average Prices</Text>
          <View style={styles.averageRow}>
            <View style={styles.avgItem}>
              <Text style={styles.avgCourse}>Starters</Text>
              <Text style={styles.avgPrice}>R{averages.starter}</Text>
            </View>
            <View style={styles.avgItem}>
              <Text style={styles.avgCourse}>Mains</Text>
              <Text style={styles.avgPrice}>R{averages.main}</Text>
            </View>
          </View>
          <View style={styles.averageRow}>
            <View style={styles.avgItem}>
              <Text style={styles.avgCourse}>Desserts</Text>
              <Text style={styles.avgPrice}>R{averages.dessert}</Text>
            </View>
            <View style={styles.avgItem}>
              <Text style={styles.avgCourse}>Beverages</Text>
              <Text style={styles.avgPrice}>R{averages.beverage}</Text>
            </View>
          </View>
        </View>

        {/* Menu Items List */}
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>R{item.price}</Text>
              </View>
              <Text style={styles.itemCourse}>{item.course}</Text>
              <Text style={styles.itemDesc}>{item.description}</Text>
              <TouchableOpacity 
                style={styles.removeBtn}
                onPress={() => removeMenuItem(item.id)}
              >
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Navigation Buttons */}
        <View style={styles.navButtons}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => setScreen('add')}
          >
            <Text style={styles.navButtonText}>Add New Item</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => setScreen('filter')}
          >
            <Text style={styles.navButtonText}>Filter Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ADD SCREEN - For adding new menu items
  if (screen === 'add') {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Add Menu Item</Text>

        <TextInput
          style={styles.input}
          placeholder="Item name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Price"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />
        
        <Text style={styles.label}>Select Course:</Text>
        <View style={styles.courseButtons}>
          <TouchableOpacity 
            style={[styles.courseBtn, course === 'starter' && styles.courseBtnActive]}
            onPress={() => setCourse('starter')}
          >
            <Text style={styles.courseBtnText}>Starter</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.courseBtn, course === 'main' && styles.courseBtnActive]}
            onPress={() => setCourse('main')}
          >
            <Text style={styles.courseBtnText}>Main</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.courseBtn, course === 'dessert' && styles.courseBtnActive]}
            onPress={() => setCourse('dessert')}
          >
            <Text style={styles.courseBtnText}>Dessert</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.courseBtn, course === 'beverage' && styles.courseBtnActive]}
            onPress={() => setCourse('beverage')}
          >
            <Text style={styles.courseBtnText}>Beverage</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={[styles.input, styles.descInput]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TouchableOpacity style={styles.addBtn} onPress={addMenuItem}>
          <Text style={styles.addBtnText}>Add to Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backBtn} onPress={() => setScreen('home')}>
          <Text style={styles.backBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // FILTER SCREEN - For guests to filter by course
  if (screen === 'filter') {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Filter Menu</Text>
        <Text style={styles.subHeader}>Choose a course to filter</Text>

        {/* Filter Buttons */}
        <View style={styles.filterButtons}>
          <TouchableOpacity 
            style={[styles.filterBtn, filterCourse === 'all' && styles.filterBtnActive]}
            onPress={() => setFilterCourse('all')}
          >
            <Text style={styles.filterBtnText}>All Items</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterBtn, filterCourse === 'starter' && styles.filterBtnActive]}
            onPress={() => setFilterCourse('starter')}
          >
            <Text style={styles.filterBtnText}>Starters</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterBtn, filterCourse === 'main' && styles.filterBtnActive]}
            onPress={() => setFilterCourse('main')}
          >
            <Text style={styles.filterBtnText}>Main Courses</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterBtn, filterCourse === 'dessert' && styles.filterBtnActive]}
            onPress={() => setFilterCourse('dessert')}
          >
            <Text style={styles.filterBtnText}>Desserts</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterBtn, filterCourse === 'beverage' && styles.filterBtnActive]}
            onPress={() => setFilterCourse('beverage')}
          >
            <Text style={styles.filterBtnText}>Beverages</Text>
          </TouchableOpacity>
        </View>

        {/* Filtered Results */}
        <Text style={styles.resultsTitle}>
          {filterCourse === 'all' ? 'All Menu Items' : filterCourse + 's'} ({filteredItems.length})
        </Text>
        
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>R{item.price}</Text>
              </View>
              <Text style={styles.itemCourse}>{item.course}</Text>
              <Text style={styles.itemDesc}>{item.description}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.noItems}>No items found</Text>
          }
        />

        <TouchableOpacity style={styles.backBtn} onPress={() => setScreen('home')}>
          <Text style={styles.backBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
}

// Styles - simple and basic
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333'
  },
  subHeader: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666'
  },
  averageBox: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  averageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  avgItem: {
    alignItems: 'center',
    flex: 1
  },
  avgCourse: {
    fontSize: 14,
    color: '#555'
  },
  avgPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff'
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#47e3c5'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333'
  },
  itemPrice: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 16
  },
  itemCourse: {
    color: '#666',
    fontSize: 14,
    marginBottom: 5,
    textTransform: 'capitalize'
  },
  itemDesc: {
    color: '#777',
    fontSize: 14
  },
  removeBtn: {
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex-start'
  },
  removeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  navButton: {
    backgroundColor: '#47e3c5',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center'
  },
  navButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16
  },
  descInput: {
    height: 80,
    textAlignVertical: 'top'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333'
  },
  courseButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  courseBtn: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    margin: 5,
    alignItems: 'center'
  },
  courseBtnActive: {
    backgroundColor: '#47e3c5'
  },
  courseBtnText: {
    fontWeight: 'bold',
    color: '#333'
  },
  addBtn: {
    backgroundColor: '#47e3c5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10
  },
  addBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  backBtn: {
    backgroundColor: '#666',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  backBtnText: {
    color: 'white',
    fontWeight: 'bold'
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  filterBtn: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
    marginBottom: 10
  },
  filterBtnActive: {
    backgroundColor: '#47e3c5'
  },
  filterBtnText: {
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center'
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  noItems: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 50
  }
});