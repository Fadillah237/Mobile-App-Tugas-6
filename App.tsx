import React, { useState, useEffect } from "react";
import axios from "axios";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from "react-native";

// Tipe data untuk Post
interface Post {
  id?: number;
  title: string;
  body: string;
}

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState<Post>({ title: "", body: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);


  const API_URL = "https://jsonplaceholder.typicode.com/posts";

  useEffect(() => {
    fetchPosts();
  }, []);


  const fetchPosts = async () => {
    try {
      const response = await axios.get(API_URL);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };


  const createPost = async () => {
    console.log("Mencoba membuat post dengan data:", newPost);
    try {
      const response = await axios.post(API_URL, newPost, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Respons:", response.data);
      setPosts([response.data, ...posts]);
      setNewPost({ title: "", body: "" });
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };


  const deletePost = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Fungsi untuk memulai mode edit
  const startEditing = (post: Post) => {
    setIsEditing(true);
    setCurrentPostId(post.id || null);
    setNewPost({ title: post.title, body: post.body });
  };


  const updatePost = async () => {
    if (currentPostId === null) return;
    console.log("Mencoba memperbarui post dengan data:", newPost);
    try {
      const response = await axios.patch(`${API_URL}/${currentPostId}`, newPost, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Respons:", response.data);
      setPosts(posts.map((post) => (post.id === currentPostId ? response.data : post)));
      setIsEditing(false);
      setCurrentPostId(null);
      setNewPost({ title: "", body: "" });
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Aplikasi CRUD Sederhana</Text>

      <View style={styles.formGroup}>
        <TextInput
          placeholder="Judul"
          value={newPost.title}
          onChangeText={(text) => setNewPost({ ...newPost, title: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Isi"
          value={newPost.body}
          onChangeText={(text) => setNewPost({ ...newPost, body: text })}
          style={[styles.input, { height: 80 }]}
          multiline
        />
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isEditing ? "#4CAF50" : "#2196F3" }]}
          onPress={isEditing ? updatePost : createPost}
        >
          <Text style={styles.buttonText}>{isEditing ? "Perbarui Post" : "Tambah Post"}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts.slice(0, 10)}
        keyExtractor={(item) => item.id?.toString() || ""}
        renderItem={({ item }) => (
          <View style={styles.postItem}>
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text style={styles.postBody}>{item.body}</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity onPress={() => startEditing(item)} style={styles.editButton}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deletePost(item.id!)} style={styles.deleteButton}>
                <Text style={styles.buttonText}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  header: {
    fontSize: 26,
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
    fontWeight: "bold",
  },
  formGroup: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor: "#f4f4f4",
  },
  button: {
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  postItem: {
    padding: 15,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: "#fff",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  postBody: {
    fontSize: 15,
    color: "#666",
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editButton: {
    padding: 10,
    backgroundColor: "#FFB74D",
    borderRadius: 6,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
  },
  deleteButton: {
    padding: 10,
    backgroundColor: "#E57373",
    borderRadius: 6,
    alignItems: "center",
    flex: 1,
    marginLeft: 5,
  },
});

export default App;
