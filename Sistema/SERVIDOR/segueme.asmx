<%@ WebService Language="C#" Class="Classe_segueme" %>

using System;
using System.Web.Services;
using Newtonsoft.Json;
using System.Linq;

[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[System.Web.Script.Services.ScriptService]
public class Classe_segueme : System.Web.Services.WebService
{

    [WebMethod]
    public string cadastrarSeguidor(string seguidor)
    {
        Seguidor seguidorD = JsonConvert.DeserializeObject<Seguidor>(seguidor);
        Sistema_OrcamentoDataContext db = new Sistema_OrcamentoDataContext();

        var novoS = new SEGUIDOR
        {
            nome = seguidorD.nome,
            email = seguidorD.email,
            endereco = seguidorD.endereco,
            fone = seguidorD.fone,
            aniversario = seguidorD.aniversario,
            nomeCirculo = seguidorD.nomeCirculo,
            padrinhos = seguidorD.padrinhos,
            anoSegueMe = seguidorD.anoSegueMe,
            paroquia = seguidorD.paroquia,
            coordenadorJovem = seguidorD.coordenadorJovem,
            status = "Ativado"
        };

        db.SEGUIDORs.InsertOnSubmit(novoS);

        try
        {
            db.SubmitChanges();
            return "Ok";
        }
        catch (Exception e)
        {
            return "Erro";
        }

    }

    [WebMethod]
    public string cadastrarSeguidorNaEquipe(string seguidorEquipe)
    {

        Seguidor seguidorEquipeD = JsonConvert.DeserializeObject<Seguidor>(seguidorEquipe);
        Sistema_OrcamentoDataContext db = new Sistema_OrcamentoDataContext();

        var novoS = new SEGUIDOREQUIPE
        {
            idSeguidor = seguidorEquipeD.idSeguidor,
            ano = seguidorEquipeD.ano,
            paroquia = seguidorEquipeD.paroquia,
            funcao = seguidorEquipeD.funcao,
            equipe = seguidorEquipeD.equipe,
            status = "Ativado"
        };

        db.SEGUIDOREQUIPEs.InsertOnSubmit(novoS);

        try
        {
            db.SubmitChanges();
            return "Ok";
        }
        catch (Exception e)
        {
            return "Erro";
        }

    }

    [WebMethod]
    public string listarSeguidorEquipe()
    {
        Sistema_OrcamentoDataContext db = new Sistema_OrcamentoDataContext();

        var seguidores = from s in db.SEGUIDOREQUIPEs
                         select new
                         {
                             s.idSeguidorEquipe,
                             s.SEGUIDOR.nome,
                             s.equipe,
                             s.funcao,
                             s.ano,
                             s.SEGUIDOR.paroquia
                         };

        var resultadoJson = JsonConvert.SerializeObject(seguidores);
        return resultadoJson;

    }

    [WebMethod]
    public string listarSeguidor()
    {
        Sistema_OrcamentoDataContext db = new Sistema_OrcamentoDataContext();

        var seguidores = from s in db.SEGUIDORs
                         select new
                         {
                             s.idSeguidor,
                             s.nome,
                             s.nomeCirculo,
                             s.padrinhos,
                             s.paroquia,
                             s.fone,
                             s.status,
                             s.endereco,
                             s.email,
                             s.coordenadorJovem,
                             s.anoSegueMe,
                             s.aniversario
                         };
        var resultadoJson = JsonConvert.SerializeObject(seguidores);
        return resultadoJson;

    }

}