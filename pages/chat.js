import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React from "react";
import appConfig from "../config.json";
import { createClient } from '@supabase/supabase-js';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzI4MTA4MiwiZXhwIjoxOTU4ODU3MDgyfQ.3DF63NYcU_Lq_1LP5e8uXzDdIeJhpMU_FMrRL_oUZjI';
const SUPABASE_URL = 'https://reqfgrgrngthvmuidqry.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function ChatPage() {
  const [mensagem, setMensagem] = React.useState("");
  const [listaDeMensagens, setListaDeMensagens] = React.useState([]);

  React.useEffect(() => {
      supabaseClient
        .from('mensagens')
        .select('*')
        .order('id', { ascending: false })
        .then(({ data }) => {
          console.log('Dados da consulta: ', data);
          setListaDeMensagens(data);
        });
  }, []);


  /* 
    // Usuário
    - Usuário digita no campo textarea
    - Aperta enter para enviar
    - Tem que adicionar o texto na listagem
    
    // Dev
    - [X] Campo criado
    - [+/-] Vamos usar o onChange usa o useState (ter um if para caso seja enter para limpar a variável)
    - [ ] Lista de mensagens
    */

  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      //id: listaDeMensagens.length + 1,
      de: "FranciscoJSSantos",
      texto: novaMensagem,
    };

    supabaseClient
      .from('mensagens')
      .insert([
        // Tem que ser um objeto com os MESMOS CAMPOS que você escreveu no supabase
        mensagem
      ])
      .then(({ data }) => {
        console.log('criar mensagem:', data);
        setListaDeMensagens([
          data[0], 
          ...listaDeMensagens,
        ]);
      });

    setMensagem('');
  }

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(https://wallpapercave.com/wp/wp8422895.jpg)`,
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <MessageList mensagens={listaDeMensagens} setMensagens={setListaDeMensagens}/>
          {/* {listaDeMensagens.map((mensagemAtual) => {
                      return (
                        <li key={mensagemAtual.id}>
                          {mensagemAtual.de} : {mensagemAtual.texto}
                        </li>
                      )
                    })} */}
          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              value={mensagem}
              onChange={(event) => {
                const valor = event.target.value;
                setMensagem(valor);
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleNovaMensagem(mensagem);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <Box>
              <Button
                label="➤"
                variant="secondary"
                colorVariant="light"
                onChange={(event) => {
                  const valor = event.target.value;
                  setMensagem(valor);
                }}
                onClick={(event) => {
                  event.preventDefault();
                  handleNovaMensagem(mensagem);
                }}
                styleSheet={{
                  width: "100%",
                  border: "0",
                  resize: "none",
                  borderRadius: "30px",
                  padding: "10px 10px",
                  marginRight: "12px",
                  marginBottom: "6px",
                  fontSize: "15px"
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList(props) {

  function handleDeleteMensagem(id){
    //tem que usar o nome da variável prop que está usando em <MessageList mensagens={...} ...>
    //aqui dentro do MessageList não existe listaMensagens
    const listaMensagensFiltered = props.mensagens.filter(
        messageFiltered =>  messageFiltered.id !== id
        ); 
    //tem que usar o nome da variável prop que está usando em <MessageList setMensagens={...} ...>
    // aqui dentro do MessageList não existe setListaMensagens
    props.setMensagens(listaMensagensFiltered);
    }
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "scroll",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
        overflow: "auto",
      }}
    >
      {props.mensagens.map((mensagem) => {
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            <Box
              styleSheet={{
                marginBottom: "8px",
              }}
            >
              <Image
                styleSheet={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/${mensagem.de}.png`}
              />
              <Text tag="strong">{mensagem.de}</Text>
              <Text
                styleSheet={{
                  fontSize: "10px",
                  marginLeft: "8px",
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {new Date().toLocaleDateString()}
              </Text>

              <Button
                label="X"
                variant="primary"
                colorVariant="negative"
                onClick={(event) => {
                  event.preventDefault();
                  handleDeleteMensagem(mensagem.id);
                }}
                styleSheet={{
                  width: "35px",
                  border: "0",
                  resize: "none",
                  borderRadius: "30px",
                  padding: "1px",
                  marginRight: "25px",
                  marginBottom: "6px",
                  marginLeft: "8px",
                }}
              />          
            </Box>
            {mensagem.texto}
          </Text>
        );
      })}
    </Box>
  );
}
