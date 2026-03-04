import React, { useState, useRef } from "react";
import styled from "styled-components";

// --- Styled Components (El CSS de tu HTML convertido) ---
const CoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  background-color: var(--white, #ffffff);
  padding: 40px;
  border-radius: var(--border-radius, 8px);
  box-shadow: var(--shadow, 0 4px 15px rgba(0, 0, 0, 0.08));
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif;
  color: var(--text-color, #333);
  line-height: 1.6;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
  border-bottom: 1px solid var(--light-gray, #e9ecef);
  padding-bottom: 20px;

  h1 {
    color: var(--primary-color, #0056b3);
    margin: 0;
    font-size: 2.2em;
    font-weight: 600;
  }

  p {
    color: #6c757d;
    font-size: 1.1em;
    margin-top: 10px;
  }
`;

const Form = styled.form`
  .form-group {
    margin-bottom: 25px;
  }

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: var(--text-color, #333);
  }

  input[type="text"],
  input[type="email"],
  input[type="number"],
  input[type="tel"],
  textarea {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ccc;
    border-radius: var(--border-radius, 8px);
    font-size: 1em;
    transition:
      border-color 0.3s,
      box-shadow 0.3s;
    box-sizing: border-box;
  }

  input:focus,
  textarea:focus {
    outline: none;
    border-color: var(--primary-color, #0056b3);
    box-shadow: 0 0 0 3px rgba(0, 86, 179, 0.2);
  }
`;

const FileUploadWrapper = styled.div`
  position: relative;
  overflow: hidden;
  display: inline-block;
  width: 100%;

  input[type="file"] {
    position: absolute;
    left: -9999px;
  }
`;

const FileUploadLabel = styled.label`
  display: block;
  padding: 12px 15px;
  border: 2px dashed var(--primary-color, #0056b3);
  border-radius: var(--border-radius, 8px);
  background-color: var(--white, #ffffff);
  color: var(--primary-color, #0056b3);
  cursor: pointer;
  text-align: center;
  transition:
    background-color 0.3s,
    color 0.3s;

  &:hover {
    background-color: #f0f8ff;
  }
`;

const ImagePreviewContainer = styled.div`
  display: none;
  margin-top: 15px;
  position: relative;
  border: 1px solid var(--light-gray, #e9ecef);
  border-radius: var(--border-radius, 8px);
  padding: 10px;
  max-height: 350px;
  max-width: 350px;
  background-color: var(--background-color, #f4f7f6);
  justify-self: center;

  img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 4px;
  }
`;

const DeleteImageButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(217, 48, 37, 0.8);
  color: var(--white, #ffffff);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 18px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(217, 48, 37, 1);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: var(--primary-color, #0056b3);
  color: var(--white, #ffffff);
  border: none;
  border-radius: var(--border-radius, 8px);
  font-size: 1.2em;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--secondary-color, #004494);
  }

  &:disabled {
    background-color: #a0a0a0;
    cursor: not-allowed;
  }
`;

const ConfirmationMessage = styled.div`
  display: none;
  text-align: center;
  padding: 20px;
  background-color: #e7f5ff;
  border: 1px solid #74c0fc;
  border-radius: var(--border-radius, 8px);
  color: #1864ab;

  h2 {
    margin-top: 0;
  }
`;

// --- El Componente de React ---
function App() {
  // --- Estados (State) ---
  const [formData, setFormData] = useState({
    company_name: "",
    contact_name: "",
    whatsapp: "",
    email: "",
    product_name: "",
    technical_details: "",
    amount: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // --- Refs para acceder directamente a los elementos del DOM ---
  const fileInputRef = useRef(null);

  // --- Manejadores de Eventos ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setImageFile(null);
    setImagePreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Limpia el input
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Crear FormData para enviar al backend
    const dataToSend = new FormData();
    for (const key in formData) {
      dataToSend.append(key, formData[key]);
    }
    if (imageFile) {
      dataToSend.append("product_image", imageFile);
    }

    const BACKEND_URL = "https://cotizacion-ten.vercel.app/api/send-email";

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        body: dataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Éxito:", result);
        setShowConfirmation(true);
      } else {
        console.error("Error del Backend:", result);
        alert(
          `Hubo un error: ${result.error || "Por favor, intenta nuevamente."}`,
        );
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert(
        "Hubo un problema de conexión con el servidor. Por favor intenta nuevamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Renderizado del Componente ---
  return (
    <CoContainer>
      <Container>
        <Header>
          <h1>Solicitud de Cotización de Productos</h1>
          <p>Su socio experto en sourcing de fertilizantes y agroinsumos.</p>
        </Header>

        {!showConfirmation ? (
          <Form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="company_name">Nombre de la Empresa *</label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact_name">Nombre de Contacto *</label>
              <input
                type="text"
                id="contact_name"
                name="contact_name"
                value={formData.contact_name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="whatsapp">Número de WhatsApp *</label>
              <input
                type="tel"
                id="whatsapp"
                name="whatsapp"
                placeholder="(+51) 923 467 635"
                value={formData.whatsapp}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo Electrónico *</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="correo@empresa.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="product_name">Nombre del Producto *</label>
              <input
                type="text"
                id="product_name"
                name="product_name"
                placeholder="Ej: Nitrato de Amonio"
                value={formData.product_name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group image-upload-area">
              <label>Imagen del Producto o RFQ</label>
              <FileUploadWrapper>
                <input
                  type="file"
                  id="product_image"
                  name="product_image"
                  accept="image/*,.pdf"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                />
                <FileUploadLabel htmlFor="product_image">
                  {imageFile
                    ? `Archivo seleccionado: ${imageFile.name}`
                    : "Haga clic para subir una imagen o PDF"}
                </FileUploadLabel>
              </FileUploadWrapper>
              <ImagePreviewContainer
                style={{ display: imagePreviewUrl ? "flex" : "none" }}
              >
                <img src={imagePreviewUrl} alt="Vista previa" />
                <DeleteImageButton type="button" onClick={handleDeleteImage}>
                  &times;
                </DeleteImageButton>
              </ImagePreviewContainer>
            </div>

            <div className="form-group">
              <label htmlFor="technical_details">Detalles Técnicos</label>
              <textarea
                id="technical_details"
                name="technical_details"
                rows="5"
                placeholder="Ej: Concentración de NPK, forma física (gránulos, líquido), especificaciones técnicas, etc."
                value={formData.technical_details}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="amount">Cantidad de Kilos Requeridos *</label>
              <input
                type="number"
                id="amount"
                name="amount"
                placeholder="Ej: 500"
                value={formData.amount}
                onChange={handleInputChange}
                required
              />
            </div>

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando Solicitud..." : "Enviar Solicitud"}
            </SubmitButton>
          </Form>
        ) : (
          <ConfirmationMessage style={{ display: "block" }}>
            <h2>Solicitud Recibida</h2>
            <p>
              Hemos recibido su solicitud de cotización. Nuestro equipo de
              especialistas está revisando los detalles y procederá a contactar
              a nuestros proveedores y socios logísticos.
            </p>
            <p>
              Le haremos llegar una propuesta completa y competitiva a la
              brevedad posible.
            </p>
            <p>
              <strong>Agradecemos su confianza en nuestros servicios.</strong>
            </p>
          </ConfirmationMessage>
        )}
      </Container>
    </CoContainer>
  );
}

export default App;
