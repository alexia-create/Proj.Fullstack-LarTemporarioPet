CREATE TYPE tipo_pet_enum AS ENUM ('cachorro', 'gato');
CREATE TYPE tipo_pet_aceito_enum AS ENUM ('cachorro', 'gato', 'ambos');
CREATE TYPE porte_pet_enum AS ENUM ('pequeno', 'medio', 'grande');
CREATE TYPE porte_pet_aceito_enum AS ENUM ('pequeno', 'medio', 'grande', 'todos');
CREATE TYPE moradia_enum AS ENUM ('casa_com_quintal', 'casa_sem_quintal', 'apartamento');
CREATE TYPE verificacao_enum AS ENUM ('pendente', 'verificado', 'rejeitado');
CREATE TYPE sexo_enum AS ENUM ('macho', 'femea');
CREATE TYPE status_animal_enum AS ENUM ('buscando_lar', 'em_lar_temporario', 'adotado');
CREATE TYPE status_solicitacao_enum AS ENUM ('pendente', 'aprovada', 'recusada', 'em_andamento', 'concluida', 'cancelada');



CREATE TABLE Usuarios (
                          id SERIAL PRIMARY KEY,
                          nome_completo VARCHAR(255) NOT NULL,
                          email VARCHAR(255) UNIQUE NOT NULL,
                          senha_hash VARCHAR(255) NOT NULL,
                          telefone VARCHAR(20),
                          cidade VARCHAR(100) NOT NULL,
                          estado VARCHAR(2) NOT NULL,
                          sobre_mim TEXT,
                          data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Voluntarios_Perfis (
                                    id SERIAL PRIMARY KEY,
                                    usuario_id INT UNIQUE NOT NULL,
                                    titulo_perfil VARCHAR(255) NOT NULL,
                                    descricao_experiencia TEXT,
                                    tipo_pet_aceito tipo_pet_aceito_enum DEFAULT 'ambos',
                                    porte_pet_aceito porte_pet_aceito_enum DEFAULT 'todos',
                                    tipo_moradia moradia_enum,
                                    status_verificacao verificacao_enum DEFAULT 'pendente',
                                    disponivel BOOLEAN DEFAULT true,

                                    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
);

CREATE TABLE Animais (
                         id SERIAL PRIMARY KEY,
                         solicitante_id INT NOT NULL,
                         nome_animal VARCHAR(100) NOT NULL,
                         tipo_animal tipo_pet_enum NOT NULL,
                         porte porte_pet_enum NOT NULL,
                         idade_aproximada VARCHAR(50),
                         sexo sexo_enum NOT NULL,
                         historia_animal TEXT NOT NULL,
                         cuidados_especiais TEXT,
                         status status_animal_enum DEFAULT 'buscando_lar',
                         data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                         FOREIGN KEY (solicitante_id) REFERENCES Usuarios(id)
);

CREATE TABLE Animais_Fotos (
                               id SERIAL PRIMARY KEY,
                               animal_id INT NOT NULL,
                               url_foto VARCHAR(255) NOT NULL,
                               descricao VARCHAR(255),

                               FOREIGN KEY (animal_id) REFERENCES Animais(id) ON DELETE CASCADE
);


CREATE TABLE Solicitacoes_Hospedagem (
                                         id SERIAL PRIMARY KEY,
                                         animal_id INT NOT NULL,
                                         solicitante_id INT NOT NULL,
                                         voluntario_id INT NOT NULL,
                                         data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                         data_inicio_prevista DATE NOT NULL,
                                         data_fim_prevista DATE NOT NULL,
                                         status_solicitacao status_solicitacao_enum DEFAULT 'pendente',
                                         mensagem_solicitante TEXT,

                                         FOREIGN KEY (animal_id) REFERENCES Animais(id) ON DELETE RESTRICT,
                                         FOREIGN KEY (solicitante_id) REFERENCES Usuarios(id) ON DELETE RESTRICT,
                                         FOREIGN KEY (voluntario_id) REFERENCES Voluntarios_Perfis(id) ON DELETE RESTRICT
);


CREATE TABLE Avaliacoes (
                            id SERIAL PRIMARY KEY,
                            solicitacao_id INT UNIQUE NOT NULL,
                            avaliador_id INT NOT NULL,
                            avaliado_id INT NOT NULL,
                            nota INT NOT NULL CHECK (nota >= 1 AND nota <= 5),
                            comentario TEXT,
                            data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                            FOREIGN KEY (solicitacao_id) REFERENCES Solicitacoes_Hospedagem(id),
                            FOREIGN KEY (avaliador_id) REFERENCES Usuarios(id),
                            FOREIGN KEY (avaliado_id) REFERENCES Voluntarios_Perfis(id)
);






